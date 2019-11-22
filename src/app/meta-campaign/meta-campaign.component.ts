import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
  public campaign: Campaign;
  public children: CampaignSummary[];
  public filterError = false;
  public fund: Fund;
  public hasTerm = false;
  public selectedSort = 'matchFundsRemaining';

  private campaignId: string;
  private campaignSlug: string;
  private fundSlug: string;
  private query: SearchQuery;

  private perPage = 6;

  constructor(
    private campaignService: CampaignService,
    private fundService: FundService,
    private pageMeta: PageMetaService,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => {
      this.campaignId = params.campaignId;
      this.campaignSlug = params.campaignSlug;
      this.fundSlug = params.fundSlug;
    });
  }

  ngOnInit() {
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

    this.handleSortParams();
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

  /**
   * Set a filter or sort value on the query
   */
  setQueryProperty(property, event) {
    this.query[property] = event.value;
    this.run();
  }

  handleSortParams() {
    this.query.sortField = this.selectedSort;
    if (this.selectedSort === '') { // this means sort by relevance for now
      this.query.sortDirection = undefined;
    } else { // match funds left and amount raised both make most sense in 'desc' order
      this.query.sortDirection = 'desc';
    }
  }

  onFilterApplied(update: {filterName: string, value: string}) {
    this.query[update.filterName] = update.value;
    this.run();
  }

  onSortApplied(selectedSort: string) {
    this.selectedSort = selectedSort;
    this.handleSortParams();
    this.run();
  }

  onMetacampaignSearch(term: string) {
    this.hasTerm = true; // Enable Relevance sort option, which we'll also now default to.
    this.query.term = term;
    this.selectedSort = '';
    this.handleSortParams();
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
      campaign.title,
      `Browse campaigns in ${campaign.title}`,
      campaign.bannerUri,
    );
  }
}
