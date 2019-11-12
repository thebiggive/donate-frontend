import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../campaign.model';
import { CampaignSummary } from '../campaign-summary.model';
import { CampaignService, SearchQuery } from '../campaign.service';
import { Fund } from '../fund.model';
import { FundService } from '../fund.service';
import { PageMetaService } from '../page-meta.service';

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
  public fund: Fund;
  public sortDirection = 'asc';
  public sortDirectionEnabled = false; // Default sort field is relevance

  private campaignId: string;
  private campaignSlug: string;
  private fundSlug: string;
  private query: SearchQuery;
  private viewportWidth: number; // In px. Used to vary `<mat-grid-list />`'s `cols`.

  private perPage = 6;

  constructor(
    private campaignService: CampaignService,
    private fundService: FundService,
    private pageMeta: PageMetaService,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
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

    if (this.fundSlug) {
      this.fundService.getOneBySlug(this.fundSlug).subscribe(fund => this.fund = fund);
    }

    this.query = {
      parentCampaignId: this.campaignId,
      parentCampaignSlug: this.campaignSlug,
      fundSlug: this.fundSlug,
      limit: this.perPage,
      offset: 0,
    };

    this.run();
  }

  /**
   * For now, just do a full search with more results requested. Not very efficient but does the job
   * for now while we focus on other priorities.
   * @todo use `offset` and load only campaigns not already likely to be on the page.
   */
  more() {
    this.query.limit += this.perPage;
    this.run();
  }

  moreMightExist(): boolean {
    return (this.children.length === this.query.limit);
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

  setSortField(event) {
    this.query.sortField = event.value;
    if (event.value === '') { // Sort by Relevance, ascending and direction locked
      this.sortDirection = 'asc';
      this.sortDirectionEnabled = false;
      this.query.sortDirection = undefined;
    } else {                  // Sort by an amount field, descending by default
      this.sortDirection = 'desc';
      this.sortDirectionEnabled = true;
      this.query.sortDirection = this.sortDirection;
    }
    this.run();
  }

  onMetacampaignSearch(term: string) {
    this.query.term = term;
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
    this.pageMeta.setCommon(
      `Campaigns in ${campaign.title}`,
      `Browse campaigns in ${campaign.title}`,
      campaign.bannerUri,
    );
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.viewportWidth = event.target.innerWidth;
  }
}
