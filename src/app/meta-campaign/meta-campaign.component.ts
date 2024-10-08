import { CurrencyPipe, DatePipe, isPlatformBrowser, ViewportScroller } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  HostListener,
  Inject,
  Input,
  makeStateKey,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  StateKey,
  TransferState,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import {SESSION_STORAGE, StorageService} from 'ngx-webstorage-service';
import {skip, Subscription} from 'rxjs';

import { Campaign } from '../campaign.model';
import { CampaignSummary } from '../campaign-summary.model';
import { CampaignService, SearchQuery } from '../campaign.service';

import { currencyPipeDigitsInfo } from '../../environments/common';
import { environment } from '../../environments/environment';
import { Fund } from '../fund.model';
import { FundService } from '../fund.service';
import { NavigationService } from '../navigation.service';
import { PageMetaService } from '../page-meta.service';
import { SearchService } from '../search.service';
import { TimeLeftPipe } from '../time-left.pipe';
import { CampaignGroupsService } from '../campaign-groups.service';

const openPipeToken = 'TimeLeftToOpenPipe';
const endPipeToken = 'timeLeftToEndPipe';

@Component({
  selector: 'app-meta-campaign',
  templateUrl: './meta-campaign.component.html',
  styleUrl: './meta-campaign.component.scss',
  providers: [
    CurrencyPipe,
    // TimeLeftPipes are stateful, so we need to use a separate pipe for each date.
    {provide: openPipeToken, useClass: TimeLeftPipe},
    {provide: endPipeToken, useClass: TimeLeftPipe},
    DatePipe,
  ],
})
export class MetaCampaignComponent implements AfterViewChecked, OnDestroy, OnInit {
  // Campaign ID may be passed instead
  @Input({ required: false }) private campaignSlug: string;
  // Passed only on the fund-filtered view of this page.
  @Input({ required: false }) private fundSlug: string;

  public campaign: Campaign;
  public children: CampaignSummary[] = [];
  public filterError = false;
  public fund?: Fund;

  public hasMore = true;
  public loading = false; // Server render gets initial result set; set true when filters change.
  public tickerItems: { label: string, figure: string }[] = [];
  public tickerMainMessage: string;
  public title: string; // Includes fund info if applicable.

  private autoScrollTimer: number | undefined; // State update setTimeout reference, for client side scroll to previous position.
  private campaignId: string;
  private offset = 0;
  private routeChangeListener: Subscription;
  private routeParamSubscription: Subscription;
  private searchServiceSubscription: Subscription;
  private shouldAutoScroll: boolean;
  // For some reason, macOS Safari on return with autoscroll enabled gave values like 192 for
  // this, whereas Chrome had a smaller number (50-60 px?). We don't want to mistake auto
  // behaviour for user scroll intervention on *any* platform because it breaks automatic
  // scrolling back to the previous metacampaign position, so to be safe we use the highest
  // scroll Y we've seen without intervention, plus a ~25% buffer.
  private smallestSignificantScrollPx = 250;
  private tickerUpdateTimer: number;

  private readonly recentChildrenKey = `${environment.donateUriPrefix}/children/v2`; // Key is per-domain/env
  private readonly recentChildrenMaxMinutes = 10; // Maximum time in mins we'll keep using saved child campaigns

  beneficiaryOptions: string[] = [];
  categoryOptions: string[] = [];
  locationOptions: string[] = [];
  parentIsSharedFund: boolean;

  currencyPipeDigitsInfo = currencyPipeDigitsInfo;
  private queryParamsSubscription: Subscription;

  constructor(
    private campaignService: CampaignService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private fundService: FundService,
    private navigationService: NavigationService,
    private pageMeta: PageMetaService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    public searchService: SearchService,
    private state: TransferState,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService,
    private scroller: ViewportScroller,
    @Inject(openPipeToken) private timeLeftToOpenPipe: TimeLeftPipe,
    @Inject(endPipeToken) private timeLeftToEndPipe: TimeLeftPipe,
  ) {
  }

  @HostListener('doSearchAndFilterUpdate', ['$event'])
  onDoSearchAndFilterUpdate(event: CustomEvent) {
    this.searchService.doSearchAndFilterAndSort(event.detail, this.getDefaultSort());
  }

  @HostListener('doCardGeneralClick', ['$event'])
  onDoCardGeneralClick(event: CustomEvent) {
    this.router.navigateByUrl(event.detail.url);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.tickerUpdateTimer) {
      clearTimeout(this.tickerUpdateTimer);
    }

    this.routeChangeListener?.unsubscribe();
    this.routeParamSubscription?.unsubscribe();
    this.searchServiceSubscription?.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.campaignId = this.campaign.id;
    this.parentIsSharedFund = this.campaign.usesSharedFunds;
    this.title = this.campaign.title;

    this.listenForRouteChanges();

    this.setSecondaryPropsAndRun(this.campaign);

    let fundKey: StateKey<Fund>;
    if (this.fundSlug) {
      fundKey = makeStateKey<Fund>(`fund-${this.fundSlug}`);
      this.fund = this.state.get<Fund | undefined>(fundKey, undefined);
      if (this.fund) {
        this.setFundSpecificProps(this.fund);
      }
    }

    if (!this.fund && this.fundSlug) {
      this.fundService.getOneBySlug(this.fundSlug).subscribe(fund => {
        this.state.set<Fund>(fundKey, fund);
        this.fund = fund;
        if (this.fund) {
          this.setFundSpecificProps(this.fund);
        }
      });
    }

    this.setTickerParams();

    this.beneficiaryOptions = CampaignGroupsService.getBeneficiaryNames();
    this.categoryOptions = CampaignGroupsService.getCategoryNames();
    this.locationOptions = CampaignGroupsService.getCountries();
    this.queryParamsSubscription = this.scrollToSearchWhenParamsChange();
  }

  private scrollToSearchWhenParamsChange() {
    return this.route.queryParams.pipe(skip(1)).subscribe((_params) => {
      if (isPlatformBrowser(this.platformId)) {
        const positionMarker = document.getElementById('SCROLL_POSITION_WHEN_PARAMS_CHANGE');

        // Angular scrolls automatically, using setTimeout to delay this scroll to a later task so this gets to
        // set the position the page is left in.
        setTimeout(() => positionMarker?.scrollIntoView({}), 0);
      }
    });
  }

  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId) && this.shouldAutoScroll) {
      // Update scroll to previous position in this scenario, unless the donor scrolls in the first 1s themselves and we turn off `shouldAutoScroll`.
      this.updateScroll(this.navigationService.getLastScrollY());
    }
  }

  onScroll() {
    if (this.scroller.getScrollPosition()[1] < this.smallestSignificantScrollPx) {
      // On return with internal app nav, automatic position seems to be [0,59]
      // or so as of Nov '22. So we want only larger scrolls to be picked up as
      // donor intervention and to turn off auto-scroll + trigger loading of
      // additional campaigns.
      return;
    }

    this.shouldAutoScroll = false;

    if (this.moreMightExist()) {
      this.more();
    }
  }

  /**
   * If we've filled the viewport plus a reasonable buffer, trigger a search with an increased offset.
   */
  more() {
    const cardsPerRow = (window.innerWidth < 600 ? 1 : (window.innerWidth < 968 ? 2 : 3));
    const safeNumberOfRows = 2 + (500 + window.scrollY) / 450; // Allow 500px for top stuff; 450px per card row; 2 spare rows
    const safeNumberToLoad = cardsPerRow * safeNumberOfRows;
    if (this.children.length < safeNumberToLoad) {
      this.loadMoreForCurrentSearch();
    }
  }

  /**
   * Default sort when not in relevance mode because there's a search term.
   */
  getDefaultSort(): 'amountRaised' | 'matchFundsRemaining' {
    // Most Raised for completed Master Campaigns; Match Funds Remaining for others.
    return (this.campaign && new Date(this.campaign.endDate) < new Date()) ? 'amountRaised' : 'matchFundsRemaining';
  }

  getPercentageRaised(childCampaign: CampaignSummary) {
    if (this.campaign.usesSharedFunds) {
      // No progressbar on child cards when parent is e.g. a shared fund emergency appeal.
      return null;
    }

    return CampaignService.percentRaisedOfIndividualCampaign(childCampaign);
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

    this.doCampaignSearch(query as SearchQuery, false);
  }

  /**
   * Also saves results for imminent future navigation to the same meta-campaign + filters.
   */
  private doCampaignSearch(query: SearchQuery, clearExisting: boolean) {
    this.campaignService.search(query as SearchQuery).subscribe(campaignSummaries => {
      // Success
      this.children = clearExisting ? campaignSummaries : [...this.children, ...campaignSummaries];
      this.loading = false;

      if (isPlatformBrowser(this.platformId)) {
        // Save children so we can go 'back' here in the browser and maintain scroll position.
        // Only an exact query match should reinstate the same child campaigns on load.
        const recentChildrenData = {
          query: this.normaliseQueryForRecentChildrenComparison(query),
          offset: this.offset,
          children: this.children,
          time: Date.now(), // ms
        };

        this.sessionStorage.set(this.recentChildrenKey, recentChildrenData);
      }
    }, () => {
      this.filterError = true; // Error, should only be thrown if the callout SF API returns an error
      this.loading = false;
    });
  }

  private moreMightExist(): boolean {
    return (this.children.length === (CampaignService.perPage + this.offset));
  }

  private run() {
    this.loading = true;
    this.offset = 0;
    const query = this.campaignService.buildQuery(this.searchService.selected, 0, this.campaignId, this.campaignSlug, this.fundSlug);

    if (!isPlatformBrowser(this.platformId)) { // Server renders don't need the scroll restoration help
      this.doCampaignSearch(query as SearchQuery, true); // Clear existing children, though there _should_ be none on server
      return;
    }

    const recentChildrenData = this.sessionStorage.get(this.recentChildrenKey);
    // Only an exact query match should reinstate the same child campaigns on load.
    if (
      recentChildrenData &&
      recentChildrenData.time > (Date.now() - (60000 * this.recentChildrenMaxMinutes)) &&
      recentChildrenData.query === this.normaliseQueryForRecentChildrenComparison(query as SearchQuery)
    ) {
      this.children = recentChildrenData.children;
      // We need to separately reinstate the offset, while excluding it from the normalised query params
      // we use for equality comparison, so that moreMightExist() and therefore scrolling to load more
      // campaigns still works after we reinstate the existing children.
      this.offset = recentChildrenData.offset;

      // Auto scrolling without a significant extra wait only works when
      // the child campaigns were quickly loaded from local state from
      // a recent page view.
      if (this.navigationService.getLastScrollY() >= this.smallestSignificantScrollPx) {
        this.shouldAutoScroll = true;
      }

      this.loading = false;

      return;
    }

    // Else need to load children newly in browser.
    this.doCampaignSearch(query as SearchQuery, true); // Clear existing children
  }

  private setSecondaryPropsAndRun(campaign: Campaign) {
    this.searchService.reset(this.getDefaultSort(), true); // Needs `campaign` to determine sort order.
    this.loadQueryParamsAndRun();

    this.pageMeta.setCommon(
      this.title,
      campaign.summary || 'A match funded campaign with Big Give',
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

  private normaliseQueryForRecentChildrenComparison(query: SearchQuery): string {
    delete query.offset;

    return JSON.stringify(query); // We don't want to get into object key / true equality comparisons, so just JSON it.
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
      if (event instanceof NavigationStart) {
        this.navigationService.saveLastScrollY(this.scroller.getScrollPosition()[1]);

        if (isPlatformBrowser(this.platformId) && this.autoScrollTimer) {
          window.clearTimeout(this.autoScrollTimer);
          this.autoScrollTimer = undefined;
        }
      }

      if (event instanceof NavigationEnd && event.url === '/') {
        this.searchService.reset(this.getDefaultSort(), false);
        this.run();
      }
    });
  }

  private updateScroll(scrollY: number | undefined) {
    if (isPlatformBrowser(this.platformId) && scrollY && !this.autoScrollTimer) {
      // We need to allow enough time for the card layout to be in place. Firefox & Chrome both seemed to consistently
      // use a too-low Y position when lots of cards were shown and we didn't have a delay, both with `scrollToAnchor()`
      // and manual calculation + `scrollToPosition()`.

      this.autoScrollTimer = window.setTimeout(() => {
        if (this.shouldAutoScroll) {
          this.scroller.scrollToPosition([0, scrollY]);
          this.autoScrollTimer = undefined;
        }
      }, 1000);
    }
  }

  private setTickerParams() {
    // Does not necessarily imply 0 raised. We occasionally open child campaigns before their parents, so it
    // is possible for the parent `campaign` here to raise more than 0 before it formally opens.
    const campaignInFuture = CampaignService.isInFuture(this.campaign);

    const campaignOpen = CampaignService.isOpenForDonations(this.campaign);
    const durationInDays = Math.floor((new Date(this.campaign.endDate).getTime() - new Date(this.campaign.startDate).getTime()) / 86400000);

    if (!this.fund) {
      if (!campaignInFuture) {
        const showGiftAid = this.campaign.currencyCode === 'GBP' && this.campaign.amountRaised > 0;
        this.tickerMainMessage = this.currencyPipe.transform(this.campaign.amountRaised, this.campaign.currencyCode, 'symbol', currencyPipeDigitsInfo) +
          ' raised' + (showGiftAid ? ' inc. Gift Aid' : '');
      } else {
        this.tickerMainMessage = 'Opens in ' + this.timeLeftToOpenPipe.transform(this.campaign.startDate);
      }
    }

    const tickerItems = [];

    if (!this.fundSlug) {
      if (campaignOpen) {
        tickerItems.push(...[
          {
            label: 'remaining',
            figure: this.timeLeftToEndPipe.transform(this.campaign.endDate),
          },
          {
            label: 'match funds remaining',
            figure: this.currencyPipe.transform(this.campaign.matchFundsRemaining, this.campaign.currencyCode, 'symbol', currencyPipeDigitsInfo) as string,
          },
        ]);
      } else {
        tickerItems.push({
          label: 'days duration',
          figure: durationInDays.toString(),
        });
      }

      if (this.campaign.campaignCount && this.campaign.campaignCount > 1) {
        tickerItems.push(
          {
            label: 'participating charities',
            figure: this.campaign.campaignCount.toLocaleString(),
          }
        )
      }

      if (this.campaign.donationCount > 0) {
        tickerItems.push(
          {
            label: 'donations',
            figure: this.campaign.donationCount.toLocaleString(),
          }
        )
      }

      tickerItems.push({
        label: 'total match funds',
        figure: this.currencyPipe.transform(this.campaign.matchFundsTotal, this.campaign.currencyCode, 'symbol', currencyPipeDigitsInfo) as string,
      });
    }

    // Just update the public property once.
    if (!this.fundSlug) {
      this.tickerItems = tickerItems;
    }

    if (this.tickerUpdateTimer) {
      window.clearTimeout(this.tickerUpdateTimer);
    }

    // Load data just once, but refresh e.g. time left to launch summary once
    // per second.
    if (isPlatformBrowser(this.platformId) && !this.fundSlug) {
      this.tickerUpdateTimer = window.setTimeout(() => {
        this.setTickerParams()
      }, 1000);
    }
  }

  private setFundSpecificProps(fund: Fund) {
    this.tickerMainMessage = this.currencyPipe.transform(fund.amountRaised, this.campaign.currencyCode, 'symbol', currencyPipeDigitsInfo) +
      ' raised' + (this.campaign.currencyCode === 'GBP' ? ' inc. Gift Aid' : '');

    const durationInDays = Math.floor((new Date(this.campaign.endDate).getTime() - new Date(this.campaign.startDate).getTime()) / 86400000);
    const tickerItems = [];
    tickerItems.push({
      label: 'total match funds',
      figure: this.currencyPipe.transform(
        fund.totalForTicker,
        this.campaign.currencyCode,
        'symbol',
        currencyPipeDigitsInfo
      ) as string,
    });
    if (CampaignService.isOpenForDonations(this.campaign)) {
      tickerItems.push({
        label: 'remaining',
        figure: this.timeLeftToEndPipe.transform(this.campaign.endDate),
      });
    } else {
      tickerItems.push({
        label: 'days duration',
        figure: durationInDays.toString(),
      });
    }
    this.tickerItems = tickerItems;

    // Show fund name if applicable *and* there's no fund logo. If there's a logo
    // its content + alt text should do the equivalent job.
    this.title = (!fund.logoUri && fund.name)
      ? `${this.campaign.title}: ${fund.name}`
      : this.campaign.title;

    this.pageMeta.setCommon(
      this.title,
      this.campaign.summary || 'A match funded campaign with Big Give',
      this.campaign.bannerUri,
    );
  }
}
