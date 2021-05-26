import { Component, OnDestroy, OnInit } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { Campaign } from '../campaign.model';
import { CampaignSummary } from '../campaign-summary.model';
import { CampaignService, SearchQuery } from '../campaign.service';
import { Fund } from '../fund.model';
import { FundService } from '../fund.service';
import { PageMetaService } from '../page-meta.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-meta-campaign',
  templateUrl: './meta-campaign.component.html',
  styleUrls: ['./meta-campaign.component.scss'],
})
export class MetaCampaignComponent implements OnDestroy, OnInit {
  public campaign: Campaign;
  public children: CampaignSummary[];
  public filterError = false;
  public fund?: Fund;
  public fundSlug: string;
  public hasMore = true;
  public loading = false; // Server render gets initial result set; set true when filters change.

  private campaignId: string;
  private campaignSlug: string;
  private offset = 0;
  private routeChangeListener: Subscription;
  private routeParamSubscription: Subscription;
  private searchServiceSubscription: Subscription;

  constructor(
    private campaignService: CampaignService,
    private fundService: FundService,
    private pageMeta: PageMetaService,
    private router: Router,
    private route: ActivatedRoute,
    public searchService: SearchService,
    private state: TransferState,
  ) {
    route.params.pipe().subscribe(params => {
      this.campaignSlug = params.campaignSlug;
      this.fundSlug = params.fundSlug;
    });
  }

  ngOnDestroy() {
    if (this.routeChangeListener) {
      this.routeChangeListener.unsubscribe();
    }

    if (this.routeParamSubscription) {
      this.routeParamSubscription.unsubscribe();
    }

    if (this.searchServiceSubscription) {
      this.searchServiceSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.campaignId = this.campaign.id;

    this.listenForRouteChanges();

    this.setSecondaryPropsAndRun(this.campaign);

    let fundKey: StateKey<string>;
    if (this.fundSlug) {
      fundKey = makeStateKey<Fund>(`fund-${this.fundSlug}`);
      this.fund = this.state.get(fundKey, undefined);
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

  clear() {
    this.searchService.reset(this.getDefaultSort(), false);
  }

  /**
   * Default sort when not in relevance mode because there's a search term.
   */
  getDefaultSort(): 'amountRaised' | 'matchFundsRemaining' {
    // Most Raised for completed Master Campaigns; Match Funds Remaining for others.
    return (this.campaign && new Date(this.campaign.endDate) < new Date()) ? 'amountRaised' : 'matchFundsRemaining';
  }

  private loadMoreForCurrentSearch() {
    this.offset += CampaignService.perPage;
    this.loading = true;
    const query = this.campaignService.buildQuery(
      this.searchService.selected,
      this.offset,
      this.campaignId,
      this.campaignSlug,
      this.fundSlug,
    );
    this.campaignService.search(query as SearchQuery).subscribe(campaignSummaries => {
      // Success
      this.children = [...this.children, ...campaignSummaries];
      this.loading = false;
    }, () => {
      this.filterError = true; // Error, e.g. slug not known
      this.loading = false;
    });
  }

  private moreMightExist(): boolean {
    return (this.children.length === (CampaignService.perPage + this.offset));
  }

  private run() {
    this.offset = 0;
    const query = this.campaignService.buildQuery(this.searchService.selected, 0, this.campaignId, this.campaignSlug, this.fundSlug);
    this.children = [];
    this.loading = true;

    this.campaignService.search(query as SearchQuery).subscribe(campaignSummaries => {
        this.children = campaignSummaries; // Success
        this.loading = false;
      }, () => {
        this.filterError = true; // Error, e.g. slug not known
        this.loading = false;
      },
    );
  }

  private setSecondaryPropsAndRun(campaign: Campaign) {
    this.searchService.reset(this.getDefaultSort(), true); // Needs `campaign` to determine sort order.
    this.loadQueryParamsAndRun();
    this.pageMeta.setCommon(
      campaign.title,
      campaign.summary || 'A match funded campaign with the Big Give',
      campaign.bannerUri,
    );
  }

  /**
   * Get any query params from the requested URL.
   */
  private loadQueryParamsAndRun() {
    this.routeParamSubscription = this.route.queryParams.subscribe(params => {
        this.searchService.loadQueryParams(params, this.getDefaultSort());
        this.run();
    });

    this.searchServiceSubscription = this.searchService.changed.subscribe((interactive: boolean) => {
      if (!interactive) {
        return;
      }

      this.setQueryParams(); // Trigger a route change which in turn causes a `run()`.
    });
  }

  /**
   * Update the browser's query params when a sort or filter is applied.
   */
  private setQueryParams() {
    this.router.navigate([], {
      queryParams: this.searchService.getQueryParams(this.getDefaultSort()),
    });
  }

  private listenForRouteChanges() {
    this.routeChangeListener = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/') {
        this.searchService.reset(this.getDefaultSort(), false);
        this.run();
      }
    });
  }
}
