import { CommonModule, CurrencyPipe } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CampaignDetailsComponent } from './campaign-details.component';
import { OptimisedImagePipe } from '../optimised-image.pipe';
import { TimeLeftPipe } from '../time-left.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('CampaignDetailsComponent', () => {
  let component: CampaignDetailsComponent;
  let fixture: ComponentFixture<CampaignDetailsComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CampaignDetailsComponent,
      ],
      imports: [
        CommonModule,
        CurrencyPipe,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        NoopAnimationsModule,
        OptimisedImagePipe,
        RouterModule.forRoot([]),
      ],
      providers: [
        TimeLeftPipe,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignDetailsComponent);
    component = fixture.componentInstance;
    component.campaign = {
      id: 'testCampaignId',
      aims: ['Aim 1'],
      amountRaised: 123,
      additionalImageUris: [],
      bannerUri: 'https://example.com/banner.png',
      beneficiaries: ['Other'],
      budgetDetails: [],
      categories: ['Animals'],
      championName: 'Some Champion',
      isRegularGiving: false,
      charity: {
        id: 'testCharityId',
        name: 'Test Charity',
        optInStatement: 'Opt in statement.',
        website: 'https://www.testcharity.co.uk',
        regulatorNumber: '123456',
        regulatorRegion: 'Scotland',
      },
      countries: ['United Kingdom'],
      currencyCode: 'GBP',
      donationCount: 4,
      endDate: new Date(),
      impactReporting: 'Impact reporting plan',
      impactSummary: 'Impact overview',
      isMatched: true,
      matchFundsRemaining: 987,
      matchFundsTotal: 988,
      parentUsesSharedFunds: false,
      problem: 'The situation',
      quotes: [],
      ready: true,
      solution: 'The solution',
      startDate: new Date(),
      status: 'Active',
      summary: 'Test campaign description',
      title: 'Test Campaign!',
      updates: [],
      usesSharedFunds: false,
      alternativeFundUse: 'Some information about what happens if funds are not used',
      campaignCount: undefined,
      championOptInStatement: undefined,
      championRef: undefined,
      hidden: false,
      logoUri: undefined,
      parentAmountRaised: undefined,
      parentDonationCount: undefined,
      parentRef: undefined,
      parentTarget: undefined,
      surplusDonationInfo: undefined,
      target: 1234,
      thankYouMessage: undefined,
      video: {
        provider: 'youtube',
        key: 'someFakeKey',
      },
  };
    // For now, *don't* detect changes as ngOnInit() will clear out the fixed `campaign` trying to
    // read a value from the state transfer service. TODO it would be better to mock an HTTP response
    // instead so the data is loaded in a more realistic way.
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load key data from test campaign', () => {
    if (!component.campaign) {
      expect(false).toBeTrue(); // campaign unexpectedly undefined
      return;
    }
    expect(component.campaign.title).toBe('Test Campaign!');
    expect(component.campaign.isMatched).toBe(true);
    expect(component.campaign.charity.name).toBe('Test Charity');
    expect(component.campaign.aims[0]).toBe('Aim 1');
    expect(component.campaign.video).toBeDefined();
    if (component.campaign.video) {
      expect(component.campaign.video.provider).toBe('youtube');
    } else {
      expect(false).toBeTrue(); // video unexpectedly undefined
    }
  });
});
