import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Campaign } from './campaign.model';
import {CampaignService} from './campaign.service';
import { environment } from '../environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CampaignService', () => {
  const getDummyCampaign = () : Campaign => {
    return {
      id: 'a051r00001EywjpAAB',
      aims: ['Aim 1'],
      amountRaised: 200.00,
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
        website: 'https://www.awesomecharity.co.uk',
        regulatorNumber: '123456',
        regulatorRegion: 'Scotland',
      },
      countries: ['United Kingdom'],
      currencyCode: 'GBP',
      donationCount: 4,
      endDate: new Date().toISOString(),
      impactReporting: 'Impact reporting plan',
      impactSummary: 'Impact overview',
      isMatched: true,
      matchFundsRemaining: 987.00,
      matchFundsTotal: 988.00,
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
      startDate: new Date().toISOString(),
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
      }
    }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [CampaignService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}));

  it('should retrieve campaign details from API', () => {
    const service: CampaignService = TestBed.inject(CampaignService);
    const httpMock: HttpTestingController = TestBed.inject(HttpTestingController);

    const dummyCampaign: Campaign = getDummyCampaign();

    service.getOneById('a051r00001EywjpAAB').subscribe(campaign => {
      expect(campaign).toEqual(dummyCampaign);
    }, () => {
      expect(false).toBe(true); // Always fail if observable errors
    });

    const request = httpMock.expectOne(`${environment.apiUriPrefix}/campaigns/services/apexrest/v1.0/campaigns/a051r00001EywjpAAB`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyCampaign);
  });

  it ('should allow donation attempts to any campaign with status Active, regardless of its dates', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() - 86400000).toISOString();
    campaign.endDate = new Date((new Date()).getTime() - 86400000).toISOString();
    campaign.status = 'Active';

    expect(CampaignService.isOpenForDonations(campaign)).toBe(true);
    expect(CampaignService.isInFuture(campaign)).toBe(false);
  });

  it ('should block donation attempts to any hidden campaign', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() - 86400000).toISOString();
    campaign.endDate = new Date((new Date()).getTime() + 86400000).toISOString();
    campaign.status = 'Active';
    campaign.hidden = true;

    expect(CampaignService.isOpenForDonations(campaign)).toBe(false);
  });

  it ('should allow donation attempts to any campaign in active date range, even if Status gets stuck in Preview', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() - 86400000).toISOString();
    campaign.endDate = new Date((new Date()).getTime() + 86400000).toISOString();
    campaign.status = 'Preview';

    expect(CampaignService.isOpenForDonations(campaign)).toBe(true);
    expect(CampaignService.isInFuture(campaign)).toBe(false);
  });

  it ('should not allow donation attempts to Preview campaigns with future start dates', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() + 86400000).toISOString();
    campaign.endDate = new Date((new Date()).getTime() + 86400001).toISOString();
    campaign.status = 'Preview';

    expect(CampaignService.isOpenForDonations(campaign)).toBe(false);
    expect(CampaignService.isInFuture(campaign)).toBe(true);
  });

  it ('should allow not allow donation attempts to Expired campaigns with past end dates', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() - 86400000).toISOString();
    campaign.endDate = new Date((new Date()).getTime() - 1000).toISOString();
    campaign.status = 'Expired';

    expect(CampaignService.isOpenForDonations(campaign)).toBe(false);
    expect(CampaignService.isInFuture(campaign)).toBe(false);
  });

  it ('should return the % raised for itself when its parent does not use shared funds', () => {
    const campaign = getDummyCampaign();
    campaign.parentUsesSharedFunds = false;
    campaign.amountRaised = 98;
    campaign.target = 200;

    expect(CampaignService.percentRaisedOfCampaignOrParent(campaign)).toBe(49);
  });

  it ('should return the % raised for the parent campaign when its parent does use shared funds', () => {
    const campaign = getDummyCampaign();
    campaign.parentUsesSharedFunds = true;
    campaign.amountRaised = 98;
    campaign.target = 200;
    campaign.parentAmountRaised = 1000;
    campaign.parentTarget = 2000;

    expect(CampaignService.percentRaisedOfCampaignOrParent(campaign)).toBe(50);
  });
});


