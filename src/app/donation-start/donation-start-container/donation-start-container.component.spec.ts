import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { of } from 'rxjs';

import { DonationStartContainerComponent } from './donation-start-container.component';
import { DonationStartFormComponent } from '../donation-start-form/donation-start-form.component';
import { TBG_DONATE_STORAGE } from '../../donation.service';
import { MatomoModule } from 'ngx-matomo-client';
import { provideHttpClient, withFetch } from '@angular/common/http';

// See https://medium.com/angular-in-depth/angular-unit-testing-viewchild-4525e0c7b756
@Component({
  selector: 'app-donation-start-form',
  template: '',
  providers: [
    {
      provide: DonationStartFormComponent,
      useClass: DonationStartFormStubComponent,
    },
  ],

  // predates use of standalone
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
class DonationStartFormStubComponent {
  resumeDonationsIfPossible() {}
}

describe('DonationStartContainer', () => {
  let component: DonationStartContainerComponent;
  let fixture: ComponentFixture<DonationStartContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [DonationStartContainerComponent, DonationStartFormStubComponent],
      imports: [
        MatDialogModule,
        MatomoModule.forRoot({
          siteId: '',
          trackerUrl: '',
        }),
        RouterLink,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: {
              data: { campaign: getDummyCampaign('testCampaignIdForStripe') },
            },
          },
        },
        InMemoryStorageService,
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationStartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should call Identity.getIdAndJWT()`, () => {
    // This leads to conditional Person-loading logic afterwards, where applicable.
    spyOn(component.identityService, 'getIdAndJWT');
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
    expect(component.identityService.getIdAndJWT).toHaveBeenCalled();
  });

  const getDummyCampaign = (campaignId: string) => {
    return {
      id: campaignId,
      aims: ['Aim 1'],
      amountRaised: 200.0,
      additionalImageUris: [
        {
          uri: 'https://example.com/some-additional-image.png',
          order: 100,
        },
      ],
      bannerUri: 'https://example.com/some-banner.png',
      beneficiaries: ['Other'],
      budgetDetails: [
        {
          description: 'budget line 1',
          amount: 2000.01,
        },
      ],
      categories: ['Animals'],
      championName: 'Big Give Match Fund',
      isRegularGiving: false,
      charity: {
        id: '0011r00002HHAprAAH',
        name: 'Awesome Charity',
        optInStatement: 'Opt in statement.',
        regulatorNumber: '123456',
        regulatorRegion: 'Scotland',
        stripeAccountId: campaignId === 'testCampaignIdForStripe' ? 'testStripeAcctId' : undefined,
        website: 'https://www.awesomecharity.co.uk',
      },
      countries: ['United Kingdom'],
      currencyCode: 'GBP',
      donationCount: 4,
      endDate: new Date('2050-01-01T00:00:00'),
      impactReporting: 'Impact reporting plan',
      impactSummary: 'Impact overview',
      isMatched: true,
      matchFundsRemaining: 987.0,
      matchFundsTotal: 988.0,
      parentUsesSharedFunds: false,
      problem: 'The situation',
      quotes: [
        {
          quote: 'Some quote',
          person: 'Someones quote',
        },
      ],
      ready: true,
      solution: 'The solution',
      startDate: new Date(),
      status: 'Active',
      summary: 'Some long summary',
      title: 'Some title',
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
      target: 2000.01,
      thankYouMessage: undefined,
      video: {
        provider: 'youtube',
        key: '1G_Abc2delF',
      },
    };
  };
});
