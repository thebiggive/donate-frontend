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
import { firstValueFrom } from 'rxjs';
import { GeoJSON, Map, Rectangle } from 'leaflet';
import type { FeatureCollection, Feature, Geometry, GeoJsonProperties } from 'geojson';

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
  private resizeObserver?: ResizeObserver;

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
      minZoom: 4,
      maxZoom: 12,
    }).setView([51.505, -0.09], 4);

    const constantLayerStyle = {
      fillColor: '#c9fdd4', // Light minty green for (not project-relevant) land; we'll use BG green to highlight.
      fillOpacity: 1,
      color: '#999999', // Grey outline
      weight: 1,
    };

    // Blue background – sea / areas where we don't do geo highlighting.
    new Rectangle(
      [
        [-90, -180],
        [90, 180],
      ],
      {
        fillColor: '#dddddd',
        fillOpacity: 1,
        stroke: false,
        interactive: false,
      },
    ).addTo(this.map);

    const nationData = await firstValueFrom(this.http.get('../../assets/map/nations.geojson'));
    new GeoJSON(nationData, {
      attribution:
        'Boundaries &copy; <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Crown copyright</a>',
      style: () => constantLayerStyle,
    }).addTo(this.map);

    const englandRegionsData = await firstValueFrom(this.http.get('../../assets/map/englandRegions.geojson'));
    new GeoJSON(englandRegionsData, { style: () => constantLayerStyle }).addTo(this.map);

    const matchedRegions: string[] = [];

    // Build a layer with just project-relevant locations and a list of their names
    const highlightAreas = await this.getHighlightedFeatures(regionCodes);

    const projectLayer = new GeoJSON(highlightAreas, {
      style: () => ({
        fillColor: '#2c089b',
        fillOpacity: 0.4,
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

    this.map.fitBounds(projectLayer.getBounds());
  }

  private async getHighlightedFeatures(regionCodes: string[]): Promise<Array<Feature<Geometry, GeoJsonProperties>>> {
    const layers = [
      { path: '../../assets/map/localAuthorities.geojson', codeField: 'LAD25CD', nameField: 'LAD25NM' },
      { path: '../../assets/map/counties.geojson', codeField: 'CTYUA25CD', nameField: 'CTYUA25NM' },
      { path: '../../assets/map/englandRegions.geojson', codeField: 'RGN25CD', nameField: 'RGN25NM' },
      { path: '../../assets/map/nations.geojson', codeField: 'CTRY25CD', nameField: 'CTRY25NM' },
    ];

    const fetchPromises = layers.map(async (layer) => {
      const data = await firstValueFrom(this.http.get<FeatureCollection>(layer.path));

      return data.features
        .filter(
          (feature: Feature<Geometry, GeoJsonProperties>) =>
            feature.properties && regionCodes.includes(feature.properties[layer.codeField]),
        )
        .map((feature: Feature<Geometry, GeoJsonProperties>) => {
          if (feature.properties) {
            feature.properties['name'] = feature.properties[layer.nameField];
          }
          return feature;
        });
    });

    const results = await Promise.all(fetchPromises);
    return results.flat();
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
      .map((location) => location.countryName);
  }

  protected get hasRegions() {
    return this.campaign.locations.some((loc) => loc.regionCode !== null);
  }
}
