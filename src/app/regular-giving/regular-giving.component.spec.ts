import { RegularGivingComponent } from './regular-giving.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '../toast.service';
import { RegularGivingService } from '../regularGiving.service';
import { PageMetaService } from '../page-meta.service';
import { StripeService } from '../stripe.service';
import { DonationService } from '../donation.service';
import { AddressService } from '../address.service';
import { Campaign } from '../campaign.model';
import { Money } from '../Money';

describe('Match funds are only usable in multiples of £3', () => {
  (
    [
      [
        { matchFundsRemaining: 0, currencyCode: 'GBP', parentUsesSharedFunds: true, parentMatchFundsRemaining: -50 },
        { amountInPence: 0, currency: 'GBP' },
      ],
      [
        { matchFundsRemaining: 0, currencyCode: 'GBP', parentUsesSharedFunds: true, parentMatchFundsRemaining: -0.01 },
        { amountInPence: 0, currency: 'GBP' },
      ],
      [
        { matchFundsRemaining: 0, currencyCode: 'GBP', parentUsesSharedFunds: true, parentMatchFundsRemaining: 0 },
        { amountInPence: 0, currency: 'GBP' },
      ],
      [
        { matchFundsRemaining: 0, currencyCode: 'GBP', parentUsesSharedFunds: true, parentMatchFundsRemaining: 1 },
        { amountInPence: 0, currency: 'GBP' },
      ],
      [
        { matchFundsRemaining: 0, currencyCode: 'GBP', parentUsesSharedFunds: true, parentMatchFundsRemaining: 2.99 },
        { amountInPence: 0, currency: 'GBP' },
      ],
      [
        { matchFundsRemaining: 0, currencyCode: 'GBP', parentUsesSharedFunds: true, parentMatchFundsRemaining: 3 },
        { amountInPence: 100, currency: 'GBP' },
      ],
      [
        { matchFundsRemaining: 0, currencyCode: 'GBP', parentUsesSharedFunds: true, parentMatchFundsRemaining: 5.99 },
        { amountInPence: 100, currency: 'GBP' },
      ],
      [
        { matchFundsRemaining: 6, currencyCode: 'GBP', parentUsesSharedFunds: false, parentMatchFundsRemaining: 0 },
        { amountInPence: 200, currency: 'GBP' },
      ],
      [
        { matchFundsRemaining: 0, currencyCode: 'GBP', parentUsesSharedFunds: true, parentMatchFundsRemaining: 6 },
        { amountInPence: 200, currency: 'GBP' },
      ],
    ] as [Campaign, Money][]
  ).forEach(([campaign, maxMatchable]) => {
    it('Calculates maximum matchable given state of a campaign', () => {
      const regularGivingComponent = new RegularGivingComponent(
        // dummy value for all properties. Only function tested for now is effectively static.
        /* eslint-disable @typescript-eslint/no-explicit-any */
        undefined as any as ActivatedRoute,
        undefined as any as Toast,
        undefined as any as RegularGivingService,
        undefined as any as Router,
        undefined as any as PageMetaService,
        undefined as any as StripeService,
        undefined as any as DonationService,
        undefined as any as AddressService,
        /* eslint-enable @typescript-eslint/no-explicit-any */
      );

      expect(regularGivingComponent.maximumMatchableDonationGivenCampaign(campaign)).toEqual(maxMatchable);
    });
  });
});
