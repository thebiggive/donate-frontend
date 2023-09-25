import {Injectable} from '@angular/core';
import {MatomoTracker} from 'ngx-matomo';
import {loadStripe, PaymentIntentResult, PaymentMethod, Stripe, StripeElements, StripeError,} from '@stripe/stripe-js';

import {environment} from '../environments/environment';
import {Donation} from './donation.model';
import {DonationService} from './donation.service';
import {Campaign} from "./campaign.model";

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private didInit = false;
  private lastCardBrand?: string;
  private lastCardCountry?: string;
  private stripe: Stripe | null;

  constructor(
    private donationService: DonationService,
    private matomoTracker: MatomoTracker,
  ) {}

  async init() {
    if (this.didInit) {
      return;
    }

    this.didInit = true;

    // Initialising through the ES Module like this is not required, but is made available by
    // an official Stripe-maintained package and gives us TypeScript types for
    // the library's objects, which allows for better IDE hinting and more
    // checks that we are handling Stripe objects as intended.
    // See https://github.com/stripe/stripe-js
    this.stripe = await loadStripe(environment.psps.stripe.publishableKey);
  }

  stripeElements(donation: Donation, campaign: Campaign)
  {
    if (!this.stripe) {
      throw new Error('Stripe not ready');
    }

    const amountInMinorUnit = Math.floor((donation.tipAmount + donation.donationAmount) * 100);

    return this.stripe.elements({
      fonts: [
        {
          family: 'Euclid Triangle',
          src: `url('${environment.donateGlobalUriPrefix}/d/EuclidTriangle-Regular.1d45abfd25720872.woff2') format('woff2')`,
          weight: '400',
        },
      ],
      mode: 'payment',
      currency: donation.currencyCode.toLowerCase(),
      amount: amountInMinorUnit,
      setup_future_usage: 'on_session',
      on_behalf_of: campaign.charity.stripeAccountId,
      paymentMethodCreation: 'manual',
    });
  }

  setLastCardMetadata(cardBrand?: string, cardCountry?: string) {
    this.lastCardBrand = cardBrand;
    this.lastCardCountry = cardCountry;
  }

  async confirmPaymentWithPaymentElement(donation: Donation, elements: StripeElements): Promise<
    { paymentMethod: PaymentMethod; error?: undefined } | { paymentMethod?: undefined; error: StripeError }
  > {
    if (! this.stripe) {
    throw new Error("Stripe not ready");
    }

    const {error: submitError} = await elements.submit();
    if (submitError) {
      return {error: submitError, paymentMethod: undefined}
    }

    // If we want to not show billing details inside the Stripe payment element we have to pass billing details
    // as payment_method_data here, with at least this much detail - but we don't collect addresses in that much detail.
    const paymentMethodData = {
      billing_details:
        {
          address: {
            country: donation.countryCode,
            postal_code: donation.billingPostalAddress
          },
        }
    };

    return await this.stripe.createPaymentMethod(
      {elements: elements, params: paymentMethodData}
    );
  }

  async handleNextAction(clientSecret: string) {
    if (! this.stripe) {
      throw new Error("Stripe not ready");
    }

    return await this.stripe.handleNextAction({
      clientSecret: clientSecret
    });
  }
}
