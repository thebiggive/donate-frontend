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
  public resetSubject: Subject<void> = new Subject<void>();
  public searched = false;
  public selectedSort = 'matchFundsRemaining';

  private perPage = 6;
  private query: {[key: string]: any};
  private term: string;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.setDefaults();
    route.queryParams.forEach((params: Params) => {
      this.term = params.term;
      this.search(this.term ? this.term : '');
    });
  }

  ngOnInit() {
    this.handleFilters();

    // Navigation "changes" occur when donors navigate back to the root `/` path, e.g. from the main menu.
    // When this happens it's usually desirable to clear the filters so they have a convenient way to navigate
    // back to the default view where we surface some campaigns, if they've got lost in an overly-filtered view.
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
    ).subscribe(() => this.resetFilters());
  }

  resetFilters() {
    this.setDefaults();
    this.handleFilters();
  }

  setDefaults() {
    this.hasTerm = false;
    this.selectedSort = 'matchFundsRemaining';
    this.query = {
      limit: this.perPage,
      offset: 0,
    };
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

  onFilterApplied(update: {filterName: FilterType, value: string}) {
    this.query[update.filterName] = update.value;
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
    this.run();
  }

  search(term: string) {
    this.query.term = this.term = term;
    this.hasTerm = (term !== '');
    this.selectedSort = (term === '' ? 'matchFundsRemaining' : '');

    this.handleSortParams();
    this.run();
  }

  private handleFilters() {
    this.handleSortParams();
    this.run();

    this.resetSubject.next();
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
}
