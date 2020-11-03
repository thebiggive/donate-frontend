import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CampaignService, SearchQuery } from '../campaign.service';
import { CampaignSummary } from '../campaign-summary.model';
import { FiltersComponent } from '../filters/filters.component';

/** @todo Reduce overlap duplication w/ MetaCampaignComponent - see https://www.typescriptlang.org/docs/handbook/mixins.html */
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  campaigns: CampaignSummary[];
  defaultNonRelevanceSort: 'matchFundsRemaining' = 'matchFundsRemaining';
  loading = false; // Server render gets initial result set; set true when filters change.
  resetSubject: Subject<void> = new Subject<void>();
  searched = false;
  selected: {[key: string]: any}; // SelectedType but allowing string key lookups.
  showClearFilters = false;

  private offset = 0;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.selected = FiltersComponent.selectedDefaults(this.defaultNonRelevanceSort);
    this.loadQueryParamsAndRun();
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
    this.selected[update.filterName] = update.value as string;
    this.run();
  }

  onScroll() {
    if (this.moreMightExist()) {
      this.more();
    }
  }

  onSortApplied(selectedSort: string) {
    this.selected.sortField = selectedSort;
    this.run();
  }

  onClearFiltersApplied() {
    this.selected = FiltersComponent.selectedDefaults(this.defaultNonRelevanceSort);
    this.showClearFilters = false;
    this.run();
    this.resetSubject.next();
  }

  search(term: string) {
    this.selected.term = term;
    this.selected.sortField = term.length > 0 ? '' : this.defaultNonRelevanceSort;
    this.run();
  }

  private moreMightExist(): boolean {
    return (this.campaigns.length === (CampaignService.perPage + this.offset));
  }

  private loadMoreForCurrentSearch() {
    this.offset += CampaignService.perPage;
    this.loading = true;
    const query = this.campaignService.buildQuery(this.selected, this.offset);
    this.campaignService.search(query as SearchQuery).subscribe(campaignSummaries => {
      // Success
      this.campaigns = [...this.campaigns, ...campaignSummaries];
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  private run() {
    const query = this.campaignService.buildQuery(this.selected, 0);
    this.campaigns = [];
    this.loading = true;

    this.campaignService.search(query as SearchQuery).subscribe(campaignSummaries => {
      this.campaigns = campaignSummaries; // Success
      this.loading = false;
      this.setQueryParams();
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
      if (Object.keys(params).length > 0) {
        this.showClearFilters = true;
        for (const key of Object.keys(params)) {
          if (key === 'onlyMatching') {
            // convert URL query param string to boolean
            this.selected[key] = (params[key] === 'true');
          } else {
            this.selected[key] = params[key];
          }
        }
      }

      this.run();
    });
  }

  /**
   * Update the browser's query params when a sort or filter is applied.
   */
  private setQueryParams() {
    this.showClearFilters = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: FiltersComponent.getQueryParams(this.selected, this.defaultNonRelevanceSort),
      replaceUrl: true,
    });
  }
}
