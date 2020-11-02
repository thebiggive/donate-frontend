import { FilterType } from './../filters/filters.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CampaignService, SearchQuery } from '../campaign.service';
import { CampaignSummary } from '../campaign-summary.model';

/** @todo Reduce overlap duplication w/ MetaCampaignComponent - see https://www.typescriptlang.org/docs/handbook/mixins.html */
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  public campaigns: CampaignSummary[];
  public loading = false; // Server render gets initial result set; set true when filters change.
  public hasTerm = false;
  public query: {[key: string]: any};
  public resetSubject: Subject<void> = new Subject<void>();
  public searched = false;
  public selectedSort: string;
  public showClearFilters = false;

  private perPage = 6;
  private term: string;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.setDefaultFilters();
  }

  ngOnInit() {
    this.setDefaultFiltersOrParams();
  }

  /**
   * @method  setDefaultFiltersOrParams
   * @desc    set default filters where query params, if they exist, takes precedence.
   */
  setDefaultFiltersOrParams() {
    this.handleSortParams();
    this.setDefaultFilters();
    this.setQueryParams();

    this.run();
    this.resetSubject.next();
  }

  setDefaultFilters() {
    this.hasTerm = false;
    this.selectedSort = 'matchFundsRemaining'; // match campaigns takes precedence on explore page.
    this.query = {
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

  onFilterApplied(update: { [filterName: string]: string, value: string}) {
    this.query[update.filterName] = update.value as string;
    this.updateRoute();
    this.run();
  }

  onScroll() {
    if (this.moreMightExist()) {
      this.more();
    }
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

  search(term: string) {
    this.query.term = this.term = term;
    this.hasTerm = (term !== '');
    this.selectedSort = (term === '' ? 'matchFundsRemaining' : '');

    this.handleSortParams();
    this.updateRoute();
    this.run();
  }

  private moreMightExist(): boolean {
    return (this.campaigns.length === (this.query.limit + this.query.offset));
  }

  private loadMoreForCurrentSearch() {
    this.query.offset += this.perPage;
    this.loading = true;
    this.campaignService.search(this.query as SearchQuery).subscribe(campaignSummaries => {
      // Success
      this.campaigns = [...this.campaigns, ...campaignSummaries];
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  private run() {
    this.query.offset = 0;
    this.campaigns = [];
    this.loading = true;

    this.campaignService.search(this.query as SearchQuery).subscribe(campaignSummaries => {
      this.campaigns = campaignSummaries; // Success
      this.loading = false;
    }, () => {
        this.loading = false;
      },
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
