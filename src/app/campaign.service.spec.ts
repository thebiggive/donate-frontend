import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Campaign } from './campaign.model';
import {CampaignService} from './campaign.service';
import { environment } from '../environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CampaignService', () => {
  const getDummyCampaign = () => {
    return new Campaign(
      'a051r00001EywjpAAB',
      ['Aim 1'],
      200.00,
      [
        {
          uri: 'https://example.com/some-additional-image.png',
          order: 100,
        },
      ],
      'https://example.com/some-banner.png',
      ['Other'],
      [
        {
          description: 'budget line 1',
          amount: 2000.01,
        },
      ],
      ['Animals'],
      'Big Give Match Fund',
      {
        id: '0011r00002HHAprAAH',
        name: 'Awesome Charity',
        optInStatement: 'Opt in statement.',
        website: 'https://www.awesomecharity.co.uk',
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
      987.00,
      988.00,
      false,
      'The situation',
      [
        {
          quote: 'Some quote',
          person: 'Someones quote',
        },
      ],
      true,
      'The solution',
      new Date(),
      'Active',
      'Some long summary',
      'Some title',
      [],
      false,
      'Some information about what happens if funds are not used',
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
      2000.01,
      undefined,
      {
        provider: 'youtube',
        key: '1G_Abc2delF',
      },
    );
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
    campaign.startDate = new Date((new Date()).getTime() - 86400000);
    campaign.endDate = new Date((new Date()).getTime() - 86400000);
    campaign.status = 'Active';

    expect(CampaignService.isOpenForDonations(campaign)).toBe(true);
    expect(CampaignService.isInFuture(campaign)).toBe(false);
  });

  it ('should block donation attempts to any hidden campaign', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() - 86400000);
    campaign.endDate = new Date((new Date()).getTime() + 86400000);
    campaign.status = 'Active';
    campaign.hidden = true;

    expect(CampaignService.isOpenForDonations(campaign)).toBe(false);
  });

  it ('should allow donation attempts to any campaign in active date range, even if Status gets stuck in Preview', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() - 86400000);
    campaign.endDate = new Date((new Date()).getTime() + 86400000);
    campaign.status = 'Preview';

    expect(CampaignService.isOpenForDonations(campaign)).toBe(true);
    expect(CampaignService.isInFuture(campaign)).toBe(false);
  });

  it ('should not allow donation attempts to Preview campaigns with future start dates', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() + 86400000);
    campaign.endDate = new Date((new Date()).getTime() + 86400001);
    campaign.status = 'Preview';

    expect(CampaignService.isOpenForDonations(campaign)).toBe(false);
    expect(CampaignService.isInFuture(campaign)).toBe(true);
  });

  it ('should allow not allow donation attempts to Expired campaigns with past end dates', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() - 86400000);
    campaign.endDate = new Date((new Date()).getTime() - 1000);
    campaign.status = 'Expired';

    expect(CampaignService.isOpenForDonations(campaign)).toBe(false);
    expect(CampaignService.isInFuture(campaign)).toBe(false);
  });

  it ('should not allow donation attempts to Pending campaigns', () => {
    const campaign = getDummyCampaign();
    campaign.startDate = new Date((new Date()).getTime() + 86400000);
    campaign.endDate = new Date((new Date()).getTime() + 86400001);
    campaign.status = 'Pending';

    expect(CampaignService.isOpenForDonations(campaign)).toBe(false);
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


