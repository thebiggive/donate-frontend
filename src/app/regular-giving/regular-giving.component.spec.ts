import {RegularGivingComponent} from './regular-giving.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Toast} from '../toast.service';
import {RegularGivingService} from '../regularGiving.service';
import {PageMetaService} from '../page-meta.service';
import {StripeService} from '../stripe.service';
import {DonationService} from '../donation.service';
import {AddressService} from '../address.service';

describe('Match funds are only usable in multiples of £3', () => {
  ([
    [{matchFundsRemaining: -50, currencyCode: 'GBP'}, {amountInPence: 0, currency: 'GBP'}],
    [{matchFundsRemaining: -0.01, currencyCode: 'GBP'}, {amountInPence: 0, currency: 'GBP'}],
    [{matchFundsRemaining: 0, currencyCode: 'GBP'}, {amountInPence: 0, currency: 'GBP'}],
    [{matchFundsRemaining: 1, currencyCode: 'GBP'}, {amountInPence: 0, currency: 'GBP'}],
    [{matchFundsRemaining: 2.99, currencyCode: 'GBP'}, {amountInPence: 0, currency: 'GBP'}],
    [{matchFundsRemaining: 3, currencyCode: 'GBP'}, {amountInPence: 100, currency: 'GBP'}],
    [{matchFundsRemaining: 5.99, currencyCode: 'GBP'}, {amountInPence: 100, currency: 'GBP'}],
    [{matchFundsRemaining: 6, currencyCode: 'GBP'}, {amountInPence: 200, currency: 'GBP'}],
  ] as const).forEach(([campaign, maxMatchable]) => {
    it('Calculates maximum matchable given state of a campaign', () => {

      const regularGivingComponent = new RegularGivingComponent(
        // dummy value for all properties. Only function tested for now is effectively static.
        undefined as any as ActivatedRoute,
        undefined as any as Toast,
        undefined as any as RegularGivingService,
        undefined as any as Router,
        undefined as any as PageMetaService,
        undefined as any as StripeService,
        undefined as any as DonationService,
        undefined as any as AddressService,
      );

      expect(regularGivingComponent.maximumMatchableDonationGivenCampaign(campaign)).toEqual(maxMatchable);
    });
  })
})
