import { RegularGivingComponent } from './regular-giving.component';
import { Campaign } from '../campaign.model';
import { Money } from '../Money';
import {TestBed} from '@angular/core/testing';
import {NEVER, of} from 'rxjs';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

const stubRoute = { queryParams: NEVER } as unknown as ActivatedRoute;
stubRoute.params = of({});
stubRoute.snapshot = new ActivatedRouteSnapshot();
stubRoute.snapshot.data = { donor: null };

beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
          { provide: ActivatedRoute, useValue: stubRoute },
        ],
    });
});

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
      const regularGivingComponent = TestBed.runInInjectionContext(
        () => new RegularGivingComponent(),
      );

      expect(regularGivingComponent.maximumMatchableDonationGivenCampaign(campaign)).toEqual(maxMatchable);
    });
  });
});
