import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../campaign.model';
import { CampaignSummary } from '../campaign-summary.model';
import { CampaignService, SearchQuery } from '../campaign.service';

@Component({
  selector: 'app-meta-campaign',
  templateUrl: './meta-campaign.component.html',
  styleUrls: ['./meta-campaign.component.scss'],
})
export class MetaCampaignComponent implements OnInit {
  public beneficiaryOptions: string[];
  public campaign: Campaign;
  public categoryOptions: string[];
  public children: CampaignSummary[];
  public countryOptions: string[];
  public filterError = false;
  private query: SearchQuery;

  private campaignId: string;
  private campaignSlug: string;
  private fundSlug: string;
  private viewportWidth: number; // In px. Used to vary `<mat-grid-list />`'s `cols`.

  constructor(
    private campaignService: CampaignService,
    private meta: Meta,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private title: Title,
  ) {
    this.beneficiaryOptions = campaignService.getBeneficiaries();
    this.categoryOptions = campaignService.getCategories();
    this.countryOptions = campaignService.getCountries();

    route.params.pipe().subscribe(params => {
      this.campaignId = params.campaignId;
      this.campaignSlug = params.campaignSlug;
      this.fundSlug = params.fundSlug;
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) { // Update w.r.t. viewport only when browser-rendered
      this.viewportWidth = window.innerWidth;
    }

    if (this.campaignId) {
      this.campaignService.getOneById(this.campaignId).subscribe(campaign => this.setCampaign(campaign));
    } else {
      this.campaignService.getOneBySlug(this.campaignSlug).subscribe(campaign => this.setCampaign(campaign));
    }

    this.query = {
      parentCampaignId: this.campaignId,
      parentCampaignSlug: this.campaignSlug,
      fundSlug: this.fundSlug,
    };

    this.run();
  }

  cols(): number {
    return Math.min(3, Math.floor(this.viewportWidth / 300)); // Min 300px per col; up to 3 cols
  }

  /**
   * Set a filter or sort value on the query
   */
  setQueryProperty(property, event) {
    this.query[property] = event.value;
    this.run();
  }

  private run() {
    this.campaignService.search(this.query).subscribe(
      campaignSummaries => this.children = campaignSummaries, // Success
      () => this.filterError = true, // Error, e.g. slug not known
    );
  }

  /**
   * Set the campaign for the service and page metadata.
   */
  private setCampaign(campaign: Campaign) {
    this.campaign = campaign;
    this.title.setTitle(`Campaigns in ${campaign.title}`);
    this.meta.updateTag({ name: 'description', content: `Browse campaigns in ${campaign.title}`});
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.viewportWidth = event.target.innerWidth;
  }
}
