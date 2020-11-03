import { Component, OnInit } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Campaign } from '../campaign.model';
import { CampaignSummary } from '../campaign-summary.model';
import { CampaignService, SearchQuery } from '../campaign.service';
import { FiltersComponent } from '../filters/filters.component';
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
  public loading = false; // Server render gets initial result set; set true when filters change.
  public resetSubject: Subject<void> = new Subject<void>();
  public selected: {[key: string]: any}; // SelectedType but allowing string key lookups.
  public showClearFilters = false;

  private campaignId: string;
  private campaignSlug: string;
  private offset = 0;

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
      this.setSecondaryPropsAndRun(this.campaign);
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

  onFilterApplied(update: { [filterName: string]: string, value: string}) {
    this.selected[update.filterName] = update.value as string;
    this.run();
  }

  onSortApplied(selectedSort: string) {
    this.selected.sortField = selectedSort;
    this.run();
  }

  onClearFiltersApplied() {
    this.selected = FiltersComponent.selectedDefaults(this.getDefaultSort());
    this.showClearFilters = false;
    this.run();
    this.resetSubject.next();
  }

  onMetacampaignSearch(term: string) {
    this.selected.term = term;
    this.selected.sortField = term.length > 0 ? '' : this.getDefaultSort();
    this.run();
  }

  getDefaultSort(): string {
    // Most Raised for completed Master Campaigns; Match Funds Remaining for others.
    return (this.campaign && new Date(this.campaign.endDate) < new Date()) ? 'amountRaised' : 'matchFundsRemaining';
  }

  private loadMoreForCurrentSearch() {
    this.offset += CampaignService.perPage;
    this.loading = true;
    const query = this.campaignService.buildQuery(this.selected, this.offset);
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
    const query = this.campaignService.buildQuery(this.selected, 0);
    this.children = [];
    this.loading = true;

    this.campaignService.search(query as SearchQuery).subscribe(campaignSummaries => {
        this.children = campaignSummaries; // Success
        this.loading = false;
        this.setQueryParams();
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
    this.setSecondaryPropsAndRun(campaign);
  }

  private setSecondaryPropsAndRun(campaign: Campaign) {
    this.selected = FiltersComponent.selectedDefaults(this.getDefaultSort()); // Depends on `campaign`
    this.run();
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
      queryParams: FiltersComponent.getQueryParams(this.selected, this.getDefaultSort()),
      replaceUrl: true,
    });
  }
}
