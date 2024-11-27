import {DatePipe, isPlatformBrowser, ViewportScroller} from '@angular/common';
import {Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { BiggiveCampaignCardFilterGrid } from '@biggive/components-angular';
import {skip, Subscription} from 'rxjs';

import {currencyPipeDigitsInfo} from '../../environments/common';
import {CampaignService, SearchQuery} from '../campaign.service';
import {CampaignGroupsService} from '../campaign-groups.service';
import {CampaignSummary} from '../campaign-summary.model';
import {PageMetaService} from '../page-meta.service';
import {SearchService} from '../search.service';
import {HighlightCard} from "../highlight-cards/HighlightCard";

/** @todo Reduce overlap duplication w/ MetaCampaignComponent - see https://www.typescriptlang.org/docs/handbook/mixins.html */
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrl: 'explore.component.scss',
  providers: [DatePipe]
})
export class ExploreComponent implements OnDestroy, OnInit {
  @ViewChild(BiggiveCampaignCardFilterGrid) cardGrid: BiggiveCampaignCardFilterGrid;

  campaigns: CampaignSummary[];
  currencyPipeDigitsInfo = currencyPipeDigitsInfo;
  loading = false; // Server render gets initial result set; set true when filters change.
  /** Whether any non-default search logic besides an order change has been applied. */
  searched = false;

  private blurredSinceLastMajorScroll = false;
  private offset = 0;
  private routeParamSubscription: Subscription;
  private searchServiceSubscription: Subscription;
  private readonly smallestSignificantScrollPx = 250;

  beneficiaryOptions: string[] = [];
  categoryOptions: string[] = [];
  locationOptions: string[] = [];
  protected highlightCards: HighlightCard[];

  private queryParamsSubscription: Subscription;

  /**
   * Default sort when not in relevance mode because there's a search term.
   */
  readonly defaultSort = 'matchFundsRemaining';

  constructor(
    private campaignService: CampaignService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private pageMeta: PageMetaService,
    private scroller: ViewportScroller,
    public searchService: SearchService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnDestroy() {
    this.routeParamSubscription?.unsubscribe();
    this.searchServiceSubscription?.unsubscribe();
    this.queryParamsSubscription?.unsubscribe();
  }

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );

    this.loadQueryParamsAndRun();

    this.beneficiaryOptions = CampaignGroupsService.getBeneficiaryNames();
    this.categoryOptions = CampaignGroupsService.getCategoryNames();
    this.locationOptions = CampaignGroupsService.getCountries();

    this.queryParamsSubscription = this.scrollToSearchWhenParamsChange();
    this.highlightCards = this.route.snapshot.data.highlights;
  }

  private scrollToSearchWhenParamsChange() {
    return this.route.queryParams.pipe(skip(1)).subscribe((_params) => {
      if (isPlatformBrowser(this.platformId)) {
        const positionMarker = document.getElementById('SCROLL_POSITION_WHEN_PARAMS_CHANGE');

        // Angular routing changes scroll position (possibly while trying to restore a previous known position). Using setTimeout to
        // then scroll to the new best position for this use case (the search form and top of results) after that work has happened,
        // whenever the search filters change substantively.
        setTimeout(() => positionMarker?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
      }
    });
  }

  @HostListener('doSearchAndFilterUpdate', ['$event'])
  onDoSearchAndFilterUpdate(event: CustomEvent) {
    this.searchService.doSearchAndFilterAndSort(event.detail, this.defaultSort);
  }


  @HostListener('doCardGeneralClick', ['$event'])
  onDoCardGeneralClick(event: CustomEvent) {
    this.router.navigateByUrl(event.detail.url);
  }

  isInFuture(campaign: CampaignSummary) {
    return CampaignService.isInFuture(campaign);
  }

  isInPast(campaign: CampaignSummary) {
    return CampaignService.isInPast(campaign);
  }

  getRelevantDateAsStr(campaign: CampaignSummary) {
    const date = CampaignService.getRelevantDate(campaign);
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy, HH:mm') : null;
  };

  /**
   * If we've filled the viewport plus a reasonable buffer, trigger a search with an increased offset.
   */
  more() {
    const cardsPerRow = (window.innerWidth < 600 ? 1 : (window.innerWidth < 968 ? 2 : 3));
    const safeNumberOfRows = 2 + (500 + window.scrollY) / 450; // Allow 500px for top stuff; 450px per card row; 2 spare rows
    const safeNumberToLoad = cardsPerRow * safeNumberOfRows;
    if (this.campaigns.length < safeNumberToLoad) {
      this.loadMoreForCurrentSearch();
    }
  }

  onScroll() {
    if (this.scroller.getScrollPosition()[1] < this.smallestSignificantScrollPx) {
      this.blurredSinceLastMajorScroll = false;
      return;
    }

    if (!this.blurredSinceLastMajorScroll) {
      this.cardGrid && this.cardGrid.unfocusInputs();
      this.blurredSinceLastMajorScroll = true;
    }

    if (this.moreMightExist()) {
      this.more();
    }
  }

  clear() {
    this.searchService.reset(this.defaultSort, false);
  }

  getPercentageRaised(childCampaign: CampaignSummary) {
    return CampaignService.percentRaisedOfIndividualCampaign(childCampaign);
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
      this.searchService.loadQueryParams(params, this.defaultSort);
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
    const nextQueryParams = this.searchService.getQueryParams(this.defaultSort);
    if (JSON.stringify(this.route.snapshot.queryParams) === JSON.stringify(nextQueryParams)) {
      // Don't navigate at all if no change in query params. This saves us from inconsistencies
      // later such as scroll adjustment kicking in only when the router params actually changed,
      // and saves giving the browser needless work to do.
      return;
    }

    this.router.navigate(['explore'], { queryParams: nextQueryParams });
  }
}
