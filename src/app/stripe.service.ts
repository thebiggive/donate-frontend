import {Injectable} from '@angular/core';
import {loadStripe, PaymentMethodResult, Stripe, StripeElements} from '@stripe/stripe-js';

import {environment} from '../environments/environment';
import {Donation} from './donation.model';
import {Campaign} from "./campaign.model";

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private didInit = false;
  private stripe: Stripe | null;

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

  stripeElements(donation: Donation, campaign: Campaign) {
    if (!this.stripe) {
      throw new Error('Stripe not ready');
    }

    return this.stripe.elements({
      fonts: [
        {
          family: 'Euclid Triangle',
          // Doesn't work in local dev fast mode but should in SSR builds including live. If you need to test
          // with fast feedback, swap in Staging's base URL.
          // src: `url('${environment.donateUriPrefix}/d/EuclidTriangle-Regular.1d45abfd25720872.woff2') format('woff2')`,
          src: `url('https://donate-staging.thebiggivetest.org.uk/d/EuclidTriangle-Regular.1d45abfd25720872.woff2') format('woff2')`,
          display: 'swap',
          weight: '400',
        },
      ],
      appearance: {
        theme: 'flat',
        variables: {
          fontFamily: '"Euclid Triangle", sans-serif',
          fontLineHeight: '1.5',
          borderRadius: '0',
          colorBackground: '#F6F8FA',
          accessibleColorOnColorPrimary: '#262626'
        },
        rules: {
          '.Block': {
            backgroundColor: 'var(--colorBackground)',
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
            padding: '12px'
          },
          '.Input': {
            padding: '12px',
            border: 'solid 1px #999',
          },
          '.Input:disabled, .Input--invalid:disabled': {
            color: 'lightgray'
          },
          '.Tab': {
            padding: '10px 12px 8px 12px',
            border: 'none'
          },
          '.Tab:hover': {
            border: 'none',
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
          },
          '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
            border: 'none',
            backgroundColor: '#fff',
            boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
          },
          '.Label': {
            fontWeight: '500'
          }
        }
      },
      mode: 'payment',
      currency: donation.currencyCode.toLowerCase(),
      amount: this.amountIncTipInMinorUnit(donation),
      setup_future_usage: 'on_session',
      on_behalf_of: campaign.charity.stripeAccountId,
      paymentMethodCreation: 'manual',
    });
  }

  updateAmount(elements: StripeElements, donation: Donation) {
    elements.update({amount: this.amountIncTipInMinorUnit(donation)});
  }

  async prepareMethodFromPaymentElement(donation: Donation, elements: StripeElements): Promise<PaymentMethodResult> {
    if (! this.stripe) {
      throw new Error("Stripe not ready");
    }

    const {error: submitError} = await elements.submit();
    if (submitError) {
      return {error: submitError, paymentMethod: undefined}
    }

    // If we want to not show billing details inside the Stripe payment element we have to pass billing details
    // as `params.billing_details` here.
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

  private amountIncTipInMinorUnit(donation: Donation) {
    // use round not floor to avoid issues like returning 114 as the sum of £1 and £0.15
    return Math.round((donation.tipAmount + donation.donationAmount) * 100);
  }
}
