import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CampaignService, SearchQuery } from '../campaign.service';
import { CampaignSummary } from '../campaign-summary.model';
import { SearchService } from '../search.service';
import {Subscription} from 'rxjs';

/** @todo Reduce overlap duplication w/ MetaCampaignComponent - see https://www.typescriptlang.org/docs/handbook/mixins.html */
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnDestroy, OnInit {
  campaigns: CampaignSummary[];
  loading = false; // Server render gets initial result set; set true when filters change.
  searched = false;

  private initDone = false;
  private offset = 0;
  private routeParamSubscription: Subscription;
  private searchServiceSubscription: Subscription;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private router: Router,
    public searchService: SearchService,
  ) {}

  ngOnDestroy() {
    if (this.routeParamSubscription) {
      this.routeParamSubscription.unsubscribe();
    }

    if (this.searchServiceSubscription) {
      this.searchServiceSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.searchService.reset(this.getDefaultSort(), true);
    this.loadQueryParamsAndRun();
  }

  /**
   * Default sort when not in relevance mode because there's a search term.
   */
  getDefaultSort(): 'matchFundsRemaining' {
    return 'matchFundsRemaining';
  }

  /**
   * If we've filled the viewport plus a reasonable buffer, trigger a search with an increased offset.
   */
  more() {
    const cardsPerRow = (window.innerWidth < 600 ? 1 : (window.innerWidth < 960 ? 2 : 3));
    const safeNumberOfRows = 2 + (500 + window.scrollY) / 450; // Allow 500px for top stuff; 450px per card row; 2 spare rows
    const safeNumberToLoad = cardsPerRow * safeNumberOfRows;
    if (this.campaigns.length < safeNumberToLoad) {
      this.loadMoreForCurrentSearch();
    }
  }

  onScroll() {
    if (this.moreMightExist()) {
      this.more();
    }
  }

  clear() {
    this.searchService.reset(this.getDefaultSort(), false);
  }

  private moreMightExist(): boolean {
    return (this.campaigns.length === (CampaignService.perPage + this.offset));
  }

  private loadMoreForCurrentSearch() {
    this.offset += CampaignService.perPage;
    this.loading = true;
    const query = this.campaignService.buildQuery(this.searchService.selected, this.offset);
    this.campaignService.search(query as SearchQuery).subscribe(campaignSummaries => {
      // Success
      this.campaigns = [...this.campaigns, ...campaignSummaries];
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  private run() {
    this.offset = 0;
    const query = this.campaignService.buildQuery(this.searchService.selected, 0);
    this.campaigns = [];
    this.loading = true;

    this.campaignService.search(query as SearchQuery).subscribe(campaignSummaries => {
      this.campaigns = campaignSummaries; // Success
      this.loading = false;
    }, () => {
        this.loading = false;
      },
    );
  }

  /**
   * Get any query params from the requested URL.
   */
  private loadQueryParamsAndRun() {
    this.route.queryParams.subscribe(params => {
      if (!this.initDone) {
        this.initDone = true;
        this.searchService.loadQueryParams(params, this.getDefaultSort());
      }

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
    this.router.navigate(['explore'], {
      queryParams: this.searchService.getQueryParams(this.getDefaultSort()),
    });
  }
}
