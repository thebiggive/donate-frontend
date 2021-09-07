import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AnalyticsProduct } from './analytics-product.model';
import { AnalyticsService } from './analytics.service';
import { Campaign } from './campaign.model';
import { Donation } from './donation.model';

describe('AnalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    })
    .compileComponents();
  });

  it('should be created', () => {
    const service: AnalyticsService = TestBed.inject(AnalyticsService);
    expect(service).toBeTruthy();
  });

  it('should build a product list', () => {
    const campaign = new Campaign(
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
      'The Big Give Match Fund',
      {
        id: 'sfCharityAsd1',
        name: 'The Test Charity',
        donateLinkId: 'SFIdOrLegacyId',
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
      'The situation',
      [
        {
          quote: 'Some quote',
          person: 'Someones quote',
        },
      ],
      'The solution',
      new Date(),
      'Active',
      'Some long summary',
      2000.01,
      'The Test Campaign',
      [],
      'Some information about what happens if funds are not used',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        provider: 'youtube',
        key: '1G_Abc2delF',
      },
    );

    const donation: Donation = {
      charityId: 'sfCharityAsd1',
      charityName: 'The Test Charity',
      currencyCode: 'GBP',
      donationAmount: 6,
      donationMatched: true,
      feeCoverAmount: 0,
      giftAid: true,
      matchedAmount: 0,
      matchReservedAmount: 6,
      projectId: 'someProjectId',
      psp: 'stripe',
      tipAmount: 2,
    };

    const service: AnalyticsService = TestBed.inject(AnalyticsService);

    const expectedList: AnalyticsProduct[] = [
      {
        brand: 'The Test Charity',
        category: 'Matched donations',
        charity_campaign: 'The Test Campaign',
        gift_aid: true,
        id: 'sfCharityAsd1-m-d',
        name: 'Donation',
        price: 6,
        psp: 'stripe',
        quantity: 1,
        variant: 'With Gift Aid',
      },
      {
        brand: 'The Test Charity',
        category: 'Matched donations',
        charity_campaign: 'The Test Campaign',
        gift_aid: true,
        id: 'sfCharityAsd1-t',
        name: 'Tip',
        price: 2,
        psp: 'stripe',
        quantity: 1,
        variant: 'With Gift Aid',
      },
    ];

    expect(service.buildAllProductsData(campaign, donation)).toEqual(expectedList);
  });
});
