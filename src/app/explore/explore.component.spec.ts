import {AsyncPipe, CurrencyPipe, DatePipe, ViewportScroller} from "@angular/common";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule} from "@angular/router";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import {NEVER, of} from "rxjs";

import { ExploreComponent } from "./explore.component";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, TransferState} from "@angular/core";
import {Campaign} from "../campaign.model";
import {TimeLeftPipe} from "../time-left.pipe";
import {CampaignService} from "../campaign.service";
import {FundService} from "../fund.service";
import {NavigationService} from "../navigation.service";
import {PageMetaService} from "../page-meta.service";
import {SearchService} from "../search.service";
import {StorageService} from "ngx-webstorage-service";

describe("ExploreComponent", () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [],
      imports: [
        AsyncPipe,
        InfiniteScrollDirective,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {
            path: "search",
            component: ExploreComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                highlights: [],
              },
            },
            queryParams: of({}), // Let `loadQueryParamsAndRun()` subscribe without crashing.
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it("should create", () => {
    expect(component).toBeTruthy();
  });


  it("should show amount without Gift Aid for open campaign that raised nothing", () => {
    const campaign: Campaign = {
      id: "42",
      title: "Some Campaign",
      amountRaised: 0,
      currencyCode: "GBP",
      startDate: new Date(),
    } as Campaign;
    const sut = makeComponentWithCampaign(campaign);
    sut.ngOnInit();
    expect(sut.tickerMainMessage).toBe("£0 raised");
  });

  it("should show amount with Gift Aid for open campaign that raised something", () => {
    const campaign: Campaign = {
      id: "42",
      title: "Some Campaign",
      amountRaised: 1,
      currencyCode: "GBP",
      startDate: new Date(),
    } as Campaign;
    const sut = makeComponentWithCampaign(campaign);
    sut.ngOnInit();
    expect(sut.tickerMainMessage).toBe("£1 raised inc. Gift Aid");
  });

  it("should show something time to open for a campaign that opens tomorrow", () => {
    const dayAftertommorow = new Date(); // we don't use tommorrow because behaviour is inconsistent between 23 hours and 1 day.

    dayAftertommorow.setDate(dayAftertommorow.getDate() + 2);
    dayAftertommorow.setHours(dayAftertommorow.getHours() + 1);
    const campaign: Campaign = {
      id: "42",
      title: "Some Campaign",
      amountRaised: 1,
      currencyCode: "GBP",
      startDate: dayAftertommorow,
    } as Campaign;
    const sut = makeComponentWithCampaign(campaign);
    sut.ngOnInit();
    expect(sut.tickerMainMessage).toBe("Opens in 2 days");
  });

  function makeComponentWithCampaign(campaign: Campaign) {
    const noop = () => {};

    const pipe = new TimeLeftPipe("browser", {
      markForCheck: noop,
    } as unknown as ChangeDetectorRef);
    const timeLeftToOpenPipe = pipe;
    const timeLeftToClosePipe = pipe;

    const currencyPipe = new CurrencyPipe("en-GB", "GBP");

    const stubRoute = { queryParams: NEVER } as unknown as ActivatedRoute;
    stubRoute.params = of({});
    stubRoute.snapshot = new ActivatedRouteSnapshot();
    stubRoute.snapshot.data = { campaign: campaign };

    const dummyCampaignService = {} as CampaignService;
    const dummyDatePipe = {} as DatePipe;
    const dummyFundService = {} as FundService;
    const dummyNavigationService = {
      getPotentialRedirectPathAndUpdateSignal: () => null,
    } as unknown as NavigationService;
    const dummyPageMeta = { setCommon: noop } as unknown as PageMetaService;
    const dummyPLATFORM_ID = {} as Object;
    const dummyRouter = { events: NEVER } as unknown as Router;
    const dummySearchService = {
      changed: new EventEmitter(),
      reset: noop,
    } as unknown as SearchService;
    const dummyState = {} as TransferState;
    const dummyTBG_DONATE_STORAGE = {} as StorageService;
    const dummyScroller = {} as ViewportScroller;

    return new ExploreComponent(
      dummyCampaignService,
      currencyPipe,
      dummyDatePipe,
      dummyFundService,
      dummyNavigationService,
      stubRoute,
      dummyRouter,
      dummyPageMeta,
      dummyScroller,
      dummySearchService,
      dummyPLATFORM_ID,
      dummyState,
      timeLeftToOpenPipe,
      timeLeftToClosePipe,
      dummyTBG_DONATE_STORAGE,
  );
  }
});
