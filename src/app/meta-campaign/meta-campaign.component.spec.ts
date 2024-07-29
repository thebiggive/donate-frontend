import {AsyncPipe, CommonModule, CurrencyPipe, DatePipe, ViewportScroller} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TransferState} from "@angular/core";
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {InMemoryStorageService, StorageService} from 'ngx-webstorage-service';
import {NEVER, of} from 'rxjs';

import {Campaign} from '../campaign.model';
import {CampaignSummary} from '../campaign-summary.model';
import {TBG_DONATE_STORAGE} from '../donation.service';
import {MetaCampaignComponent} from './meta-campaign.component';
import {TimeLeftPipe} from '../time-left.pipe';
import {OptimisedImagePipe} from '../optimised-image.pipe';
import {CampaignService} from "../campaign.service";
import {FundService} from "../fund.service";
import {NavigationService} from "../navigation.service";
import {PageMetaService} from "../page-meta.service";
import {ChangeDetectorRef, EventEmitter} from "@angular/core";
import {SearchService} from "../search.service";

describe('MetaCampaignComponent', () => {
  let component: MetaCampaignComponent;
  let fixture: ComponentFixture<MetaCampaignComponent>;

  const getDummyMasterCampaign = () => new Campaign(
    'testMasterCampaignId',
    ['Aim 1'],
    123,
    [],
    'https://example.com/banner.png',
    ['Other'],
    [],
    ['Animals'],
    '',
    {
      id: 'tbgId',
      name: 'Big Give',
      optInStatement: 'Opt in statement.',
      website: 'https://www.thebiggive.org.uk',
      regulatorNumber: '123456',
      regulatorRegion: 'Scotland',
    },
    ['United Kingdom'],
    'GBP',
    4,
    new Date(),
    'Impact reporting plan',
    'Impact overview',
    true,
    987,
    988,
    false,
    'The situation',
    [],
    true,
    'The solution',
    new Date(),
    'Active',
    'Test Master Campaign detail',
    'Test Master Campaign!',
    [],
    false,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    false,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    15000,
  );

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MetaCampaignComponent,
      ],
      imports: [
        AsyncPipe,
        CommonModule,
        HttpClientTestingModule,
        InfiniteScrollModule,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        NoopAnimationsModule,
        OptimisedImagePipe,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // Let constructor pipe params without crashing.
            queryParams: of({}), // Let `loadQueryParamsAndRun()` subscribe without crashing.
            snapshot: {
              data: { campaign: getDummyMasterCampaign() },
            },
          },
        },
        // Inject in-memory storage for tests, in place of local storage.
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        InMemoryStorageService,
        TimeLeftPipe,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaCampaignComponent);
    component = fixture.componentInstance;

    component.campaign = getDummyMasterCampaign();
    component.children = [
      new CampaignSummary(
        'testCampaignId',
        123,
        ['Other'],
        ['Animals'],
        'Test Champion',
        { id: 'testCharityId', name: 'Test Charity' },
        'GBP',
        new Date(),
        'https://example.com/image.png',
        true,
        400,
        new Date(),
        'Active',
        1230,
        'Test Campaign!',
      ),
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function makeComponentWithCampaign(campaign: Campaign) {
    const noop = () => {
    };

    const timeLeftToOpenPipe = new TimeLeftPipe('browser', {markForCheck: noop} as unknown as ChangeDetectorRef);
    const timeLeftToClosePipe = new TimeLeftPipe('browser', {markForCheck: noop} as unknown as ChangeDetectorRef);
    const currencyPipe = new CurrencyPipe('en-GB', 'GBP');

    const stubRoute = {queryParams: NEVER} as unknown as ActivatedRoute;
    stubRoute.params = of({});
    stubRoute.snapshot = new ActivatedRouteSnapshot();
    stubRoute.snapshot.data = {campaign: campaign};

    const dummyCampaignService = {} as CampaignService;
    const dummyDatePipe = {} as DatePipe;
    const dummyFundService = {} as FundService;
    const dummyNavigationService = {} as NavigationService;
    const dummyPageMeta = {setCommon: noop} as unknown as PageMetaService;
    const dummyPLATFORM_ID = {} as Object;
    const dummyRouter = {events: NEVER} as unknown as Router;
    const dummySearchService = {changed: new EventEmitter(), reset: noop} as unknown as SearchService;
    const dummyState = {} as TransferState;
    const dummyTBG_DONATE_STORAGE = {} as StorageService;
    const dummyScroller = {} as ViewportScroller;

    return new MetaCampaignComponent(
      dummyCampaignService,
      currencyPipe,
      dummyDatePipe,
      dummyFundService,
      dummyNavigationService,
      dummyPageMeta,
      dummyPLATFORM_ID,
      dummyRouter,
      stubRoute,
      dummySearchService,
      dummyState,
      dummyTBG_DONATE_STORAGE,
      dummyScroller,
      timeLeftToOpenPipe,
      timeLeftToClosePipe,
    );
  }

  it('should show amount without Gift Aid for open campaign that raised nothing', () => {

    const campaign: Campaign = {id: '42', title: "Some Campaign", amountRaised: 0, currencyCode: 'GBP', startDate: new Date()} as Campaign;
    const sut = makeComponentWithCampaign(campaign);
    sut.ngOnInit();
    expect(sut.tickerMainMessage).toBe("£0 raised");
  });

  it('should show amount with Gift Aid for open campaign that raised something', () => {

    const campaign: Campaign = {id: '42', title: "Some Campaign", amountRaised: 1, currencyCode: 'GBP', startDate: new Date()} as Campaign;
    const sut = makeComponentWithCampaign(campaign);
    sut.ngOnInit();
    expect(sut.tickerMainMessage).toBe("£1 raised inc. Gift Aid");
  });

  it('should show something time to open for a campaign that opens tomorrow', () => {

    const dayAftertommorow = new Date(); // we don't use tommorrow because behaviour is inconsistent between 23 hours and 1 day.

    dayAftertommorow.setDate(dayAftertommorow.getDate()+2);
    dayAftertommorow.setHours(dayAftertommorow.getHours()+1);
    const campaign: Campaign = {id: '42', title: "Some Campaign", amountRaised: 1, currencyCode: 'GBP', startDate: dayAftertommorow} as Campaign;
    const sut = makeComponentWithCampaign(campaign);
    sut.ngOnInit();
    expect(sut.tickerMainMessage).toBe("Opens in 2 days");
  });

});
