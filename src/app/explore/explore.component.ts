import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CampaignService, SearchQuery } from '../campaign.service';
import { Campaign } from '../campaign.model';
import { CampaignGroupsService } from '../campaign-groups.service';
import { CampaignSummary } from '../campaign-summary.model';
import { PageMetaService } from '../page-meta.service';
import { SearchService } from '../search.service';

/** @todo Reduce overlap duplication w/ MetaCampaignComponent - see https://www.typescriptlang.org/docs/handbook/mixins.html */
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnDestroy, OnInit {
  campaigns: CampaignSummary[];
  loading = false; // Server render gets initial result set; set true when filters change.
  /** Whether any non-default search logic besides an order change has been applied. */
  searched = false;

  private offset = 0;
  private routeParamSubscription: Subscription;
  private searchServiceSubscription: Subscription;

  beneficiaryOptions: string[] = [];
  categoryOptions: string[] = [];
  countryOptions: string[] = [];
  fundingOptions: string[] = [];

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private router: Router,
    private pageMeta: PageMetaService,
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
    this.pageMeta.setCommon(
      'The Big Give',
      'The Big Give &ndash; discover campaigns and donate',
      false,
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );

    this.searchService.reset(this.getDefaultSort(), true);
    this.loadQueryParamsAndRun();

    this.beneficiaryOptions = CampaignGroupsService.getBeneficiaryNames();
    this.categoryOptions = CampaignGroupsService.getCategoryNames();
    this.countryOptions = CampaignGroupsService.getCountries();
    this.fundingOptions = [
      'Match Funded'
    ]
  }

  @HostListener('doSearchAndFilterUpdate', ['$event'])
  onDoSearchAndFilterUpdate(event: CustomEvent) {
    this.searchService.doSearchAndFilterAndSort(event.detail, this.getDefaultSort());
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

  getPercentageRaised(childCampaign: CampaignSummary) {
    if (childCampaign.amountRaised >= childCampaign.target) {
      return 100;
    }

    return Math.round((childCampaign.amountRaised / childCampaign.target) * 100);
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
    this.searched = this.searchService.nonDefaultsActive;

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
    this.router.navigate(['explore'], {
      queryParams: this.searchService.getQueryParams(this.getDefaultSort()),
    });
  }
}
