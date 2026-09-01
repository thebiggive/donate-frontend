import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, inject, InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BiggiveCampaignHighlights } from '@biggive/components-angular';

import { currencyPipeDigitsInfo } from '../../environments/common';
import { CampaignGroupsService } from '../campaign-groups.service';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { TimeLeftPipe } from '../time-left.pipe';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeoJSON, Map, TileLayer } from 'leaflet';
import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { getHighlightedFeatures } from '../regions';

const integerPipeToken = new InjectionToken<DecimalPipe>('integerPipe');
const openPipeToken = new InjectionToken<TimeLeftPipe>('timeLeftToOpenPipe');
const endPipeToken = new InjectionToken<TimeLeftPipe>('timeLeftToEndPipe');

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrl: './campaign-info.component.scss',
  imports: [BiggiveCampaignHighlights, FontAwesomeModule],
  providers: [
    CurrencyPipe,
    DatePipe,
    { provide: integerPipeToken, useClass: DecimalPipe },
    // TimeLeftPipes are stateful, so we need to use a separate pipe for each date.
    { provide: openPipeToken, useClass: TimeLeftPipe },
    { provide: endPipeToken, useClass: TimeLeftPipe },
  ],
})
export class CampaignInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  private currencyPipe = inject(CurrencyPipe);
  datePipe = inject(DatePipe);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  integerPipe = inject<DecimalPipe>(integerPipeToken);
  timeLeftToOpenPipe = inject<TimeLeftPipe>(openPipeToken);
  timeLeftToEndPipe = inject<TimeLeftPipe>(endPipeToken);

  @Input({ required: true }) campaign!: Campaign;
  campaignOpen!: boolean;
  campaignFinished!: boolean;
  campaignRaised!: string; // Formatted
  campaignTarget!: string; // Formatted
  campaignParentFundsRemaining: string | undefined; // formatted
  impactRegions: string = '';

  @ViewChild('mapElement') mapElement!: ElementRef<HTMLDivElement>;

  // Typescript has trouble distinguishing JS built-in Map vs Leaflet's Map since we are using a loose typings file for leaflet v2.
  // We explicitly use 'any' here since the actual typings for Leaflet Map aren't strictly available in this declaration.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map?: any;
  private projectBounds?: DOMRect;
  private resizeObserver?: ResizeObserver;
  private readonly boundsPadding = [8, 8];

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign || this.campaign;
    this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
    this.campaignFinished = CampaignService.isInPast(this.campaign);
    this.campaignTarget = this.currencyPipe.transform(
      this.campaign.target,
      this.campaign.currencyCode,
      'symbol',
      currencyPipeDigitsInfo,
    ) as string;

    if (this.campaign.parentUsesSharedFunds) {
      this.campaignParentFundsRemaining = this.currencyPipe.transform(
        this.campaign.parentMatchFundsRemaining,
        this.campaign.currencyCode,
        'symbol',
        currencyPipeDigitsInfo,
      ) as string;
    }

    this.campaignRaised = this.currencyPipe.transform(
      this.campaign.amountRaised,
      this.campaign.currencyCode,
      'symbol',
      currencyPipeDigitsInfo,
    ) as string;
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const regionCodes = this.campaign.locations
      .map((loc) => loc.regionCode)
      .filter((code): code is string => code !== null);

    if (regionCodes.length === 0 || !this.mapElement) {
      return;
    }

    // Use ResizeObserver to only initialize fetching and Leaflet map when the container becomes visible
    // (e.g. desktop vs mobile view via CSS display states).
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          if (!this.map) {
            this.initMap(regionCodes);
          } else {
            this.map.invalidateSize();
            if (this.projectBounds) {
              this.map.fitBounds(this.projectBounds, { padding: this.boundsPadding });
            }
          }
        }
      }
    });

    this.resizeObserver.observe(this.mapElement.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  private async initMap(regionCodes: string[]) {
    // Check again in case it got destroyed while waiting
    if (!this.mapElement) return;

    this.map = new Map(this.mapElement.nativeElement, {
      dragging: false,
      // Setting min + max zoom to the view bounds level alone didn't seem to reliably make controls do nothing.
      // So switching off every way I could find to zoom (the following 6 lines) seems the only safe way to
      // achieve this.
      zoomControl: false,
      boxZoom: false,
      doubleClickZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      touchZoom: false,
      zoomSnap: 0.25, // Increases the likelihood of a tight crop around the project area vs. default steps of 1.
    }).setView([51.505, -0.09], 4); // Replaced later when we fit project highlight bounds.

    const matchedRegions: string[] = [];

    // Build a layer with just project-relevant locations and a list of their names
    const highlightAreas = await getHighlightedFeatures(regionCodes, this.http);

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 13,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    const projectLayer = new GeoJSON(highlightAreas, {
      attribution:
        'boundaries &copy; <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Crown copyright</a>',
      style: () => ({
        fillColor: '#2c089b',
        fillOpacity: 0.2,
        color: '#2c089b',
        weight: 1.5,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: any) => {
        if (feature.properties && feature.properties['name']) {
          layer.bindPopup(feature.properties['name']);
          // Check for unique to avoid duplicates from e.g. unitary authorities that are in 2 sources.
          if (!matchedRegions.includes(feature.properties['name'])) {
            matchedRegions.push(feature.properties['name']);
          }
        }
      },
    }).addTo(this.map);

    // Want to change this in one go to encourage screen readers to politely announce a change just once.
    this.impactRegions = `UK impact is in ${matchedRegions.join(', ')}`; // No 'and' for now, think it's enough to encourage pauses.

    this.projectBounds = projectLayer.getBounds();
    this.map.fitBounds(this.projectBounds, { padding: this.boundsPadding });
  }

  getPercentageRaised(campaign: Campaign): number | undefined {
    return CampaignService.percentRaisedOfCampaign(campaign);
  }

  getBeneficiaryIcon(beneficiary: string) {
    return CampaignGroupsService.getBeneficiaryIcon(beneficiary);
  }

  getCategoryIcon(category: string) {
    return CampaignGroupsService.getCategoryIcon(category);
  }

  get championUrl() {
    // Champion ref can be an ID if there's no slug, which doesn't really work but in practice Donate
    // redirects to the overall `parentRef`. In the absence of support for non-linked names this is probably
    // the best fallback.
    return `/${this.campaign.parentRef}/${this.campaign.championRef}`;
  }

  protected get countries() {
    return this.campaign.locations
      .filter((location) => location.countryName !== null)
      .map((location) => location.countryName)
      .sort((a, b) => a.localeCompare(b));
  }

  protected get hasRegions() {
    return this.campaign.locations.some((loc) => loc.regionCode !== null);
  }

  /**
   * Gets the main text to show on near the top of the sidebar, about if/when the campaign is going to open or close
   */
  protected get primaryStatText(): string {
    if (this.campaignFinished) {
      return 'Closed ' + this.datePipe.transform(this.campaign.endDate, 'd LLL yyyy')!;
    }

    if (this.campaignOpen) {
      return this.timeLeftToEndPipe.transform(this.campaign.endDate) + ' left';
    }

    if (new Date(this.campaign.startDate) > new Date()) {
      return 'Opens in ' + this.timeLeftToOpenPipe.transform(this.campaign.startDate);
    }

    // If we're here we know that the campaign is not open, but neither closed in the past
    // nor is opening in the future. It may be not open because it doesn't have the
    // required funds. In that case we don't expect the public to be looking at this
    //  page, so we just return the empty string and don't say why it's not open:

    return '';
  }
}
