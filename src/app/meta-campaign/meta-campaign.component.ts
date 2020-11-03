import { Component, OnInit } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

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
  public campaign?: Campaign;
  public children: CampaignSummary[];
  public filterError = false;
  public fund?: Fund;
  public fundSlug: string;
  public hasMore = true;
  public hasTerm = false;
  public loading = false; // Server render gets initial result set; set true when filters change.
  public query: {[key: string]: any};
  public resetSubject: Subject<void> = new Subject<void>();
  public selectedSort: string;
  public showClearFilters = false;

  private campaignId: string;
  private campaignSlug: string;
  private perPage = 6;

  constructor(
    private campaignService: CampaignService,
    private fundService: FundService,
    private pageMeta: PageMetaService,
    private router: Router,
    private route: ActivatedRoute,
    private state: TransferState,
  ) {
    route.params.pipe().subscribe(params => {
      this.campaignId = params.campaignId;
      this.campaignSlug = params.campaignSlug;
      this.fundSlug = params.fundSlug;
    });
  }

  ngOnInit() {
    let metacampaignKey: StateKey<string>;
    if (this.campaignSlug) {
      metacampaignKey = makeStateKey<Campaign>(`metacampaign-${this.campaignSlug}`);
    } else {
      metacampaignKey = makeStateKey<Campaign>(`metacampaign-${this.campaignId}`);
    }
    this.campaign = this.state.get<Campaign | undefined>(metacampaignKey, undefined);

    let fundKey: StateKey<string>;
    if (this.fundSlug) {
      fundKey = makeStateKey<Fund>(`fund-${this.fundSlug}`);
      this.fund = this.state.get(fundKey, undefined);
    }

    if (this.campaign) { // app handed over from SSR to client-side JS
      this.setDefaultFiltersOrParams();
      this.setSecondaryProps(this.campaign);
    } else {
      if (this.campaignId) {
        this.campaignService.getOneById(this.campaignId).subscribe(campaign => this.setCampaign(campaign, metacampaignKey));
      } else {
        this.campaignService.getOneBySlug(this.campaignSlug).subscribe(campaign => this.setCampaign(campaign, metacampaignKey));
      }
    }

    if (!this.fund && this.fundSlug) {
      this.fundService.getOneBySlug(this.fundSlug).subscribe(fund => {
        this.state.set(fundKey, fund);
        this.fund = fund;
      });
    }
  }

  onScroll() {
    if (this.moreMightExist()) {
      this.more();
    }
  }

  /**
   * If we've filled the viewport plus a reasonable buffer, trigger a search with an increased offset.
   */
  more() {
    const cardsPerRow = (window.innerWidth < 600 ? 1 : (window.innerWidth < 960 ? 2 : 3));
    const safeNumberOfRows = 2 + (500 + window.scrollY) / 450; // Allow 500px for top stuff; 450px per card row; 2 spare rows
    const safeNumberToLoad = cardsPerRow * safeNumberOfRows;
    if (this.children.length < safeNumberToLoad) {
      this.loadMoreForCurrentSearch();
    }
  }

  /**
   * @method  setDefaultFiltersOrParams
   * @desc    set default filters where query params, if they exist, takes precedence.
   */
  setDefaultFiltersOrParams() {
    this.setDefaultFilters();
    this.setQueryParams();

    this.run();
    this.resetSubject.next();
  }

  setDefaultFilters() {
    this.hasTerm = false;
    this.selectedSort = this.getDefaultSort();

    this.query = {
      parentCampaignId: this.campaignId,
      parentCampaignSlug: this.campaignSlug,
      fundSlug: this.fundSlug,
      limit: this.perPage,
      offset: 0,
    };
    this.handleSortParams();
  }

  handleSortParams() {
    this.query.sortField = this.selectedSort;
    if (this.selectedSort === '') { // this means sort by relevance for now
      this.query.sortDirection = undefined;
    } else { // match funds left and amount raised both make most sense in 'desc' order
      this.query.sortDirection = 'desc';
    }
  }

  onFilterApplied(update: { [filterName: string]: string, value: string}) {
    this.query[update.filterName] = update.value as string;
    this.updateRoute();
    this.run();
  }

  onSortApplied(selectedSort: string) {
    this.selectedSort = selectedSort;
    this.handleSortParams();
    this.updateRoute();
    this.run();
  }

  onClearFiltersApplied() {
    // Remove any query params from URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });

    this.showClearFilters = false;
    this.setDefaultFilters();
    this.run();
    this.resetSubject.next();
  }

  onMetacampaignSearch(term: string) {
    // Enable Relevance sort option and apply it if term is non-blank,
    // otherwise remove it and set to match funds remaining.
    this.hasTerm = (term !== '');
    this.selectedSort = (term === '' ? this.getDefaultSort() : '');

    this.query.term = term;
    this.handleSortParams();
    this.updateRoute();
    this.run();
  }

  private getDefaultSort(): string {
    // Most Raised for completed Master Campaigns; Match Funds Remaining for others.
    return (this.campaign && new Date(this.campaign.endDate) < new Date()) ? 'amountRaised' : 'matchFundsRemaining';
  }

  private loadMoreForCurrentSearch() {
    this.query.offset += this.perPage;
    this.loading = true;
    this.campaignService.search(this.query as SearchQuery).subscribe(campaignSummaries => {
      // Success
      this.children = [...this.children, ...campaignSummaries];
      this.loading = false;
    }, () => {
      this.filterError = true; // Error, e.g. slug not known
      this.loading = false;
    });
  }

  private moreMightExist(): boolean {
    return (this.children.length === (this.query.limit + this.query.offset));
  }

  private run() {
    this.query.offset = 0;
    this.children = [];
    this.loading = true;
    this.campaignService.search(this.query as SearchQuery).subscribe(campaignSummaries => {
      this.children = campaignSummaries; // Success
      this.loading = false;
    }, () => {
        this.filterError = true; // Error, e.g. slug not known
        this.loading = false;
      },
    );
  }

  /**
   * Set the campaign for the service and page metadata.
   */
  private setCampaign(campaign: Campaign, metacampaignKey: StateKey<Campaign>) {
    this.state.set(metacampaignKey, campaign); // Have data ready for client when handing over from SSR
    this.campaign = campaign;
    this.setDefaultFiltersOrParams();
    this.setSecondaryProps(campaign);
  }

  private setSecondaryProps(campaign: Campaign) {
    this.pageMeta.setCommon(
      campaign.title,
      campaign.summary || 'A match funded campaign with the Big Give',
      campaign.bannerUri,
    );
  }

  /**
   * Set query params to this.query object, if any are available.
   */
  private setQueryParams() {
      this.route.queryParams.subscribe(params => {
        if (Object.keys(params).length > 0) {
          this.showClearFilters = true;
          for (const key of Object.keys(params)) {
            if (key === 'onlyMatching') {
              // convert URL query param string to boolean
              this.query[key] = (params[key] === 'true');
            } else {
              this.query[key] = params[key];
            }
          }
        }
      });
  }

  /**
   * Dynamically update the URL route each time a sort, filter or limit is applied.
   */
  private updateRoute() {
    this.showClearFilters = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams:
      {
          sortField: this.query.sortField,
          beneficiary: this.query.beneficiary,
          category: this.query.category,
          country: this.query.country,
          onlyMatching: this.query.onlyMatching,
          term: this.query.term,
      },
      replaceUrl: true,
    });
  }
}
