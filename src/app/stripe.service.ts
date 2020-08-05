import { Injectable } from '@angular/core';
import { PaymentIntent, PaymentMethodCreateParams, Stripe, StripeCardElement, StripeElements, StripeError } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private elements: StripeElements;
  private stripe: Stripe | null;

  constructor() {}

  async init() {
    // Initialising through the ES Module like this is not required, but is made available by
    // an official Stripe-maintained package and gives us TypeScript types for
    // the library's objects, which allows for better IDE hinting and more
    // checks that we are handling Stripe objects as intended.
    // See https://github.com/stripe/stripe-js
    this.stripe = await loadStripe(environment.psps.stripe.publishableKey);
    if (this.stripe) {
      this.elements = this.stripe.elements({fonts: [
        {
          cssSrc: 'https://fonts.googleapis.com/css2?family=Maven+Pro&display=swap',
        },
      ]});
    }
  }

  async confirmCardPayment(
    clientSecret: string,
    cardElement: StripeCardElement,
    donorEmail: string,
    donorName?: string,
    donorPostcode?: string,
  ): Promise<{paymentIntent?: PaymentIntent; error?: StripeError}> {
    if (!this.stripe) {
      console.log('Stripe not ready');
      return {};
    }

    const billingDetails: PaymentMethodCreateParams.BillingDetails = {
      email: donorEmail,
      name: donorName ?? undefined,
    };

    if (donorPostcode) {
      billingDetails.address = {
        country: 'GB',
        postal_code: donorPostcode,
      };
    }

    const result = await this.stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          // See https://stripe.com/docs/payments/accept-a-payment#web-submit-payment
          billing_details: billingDetails,
        },
      },
    );

    return result;
  }

  createCard(): StripeCardElement | null {
    if (!this.elements) {
      console.log('Stripe Elements not ready');
      return null;
    }

    const existingElement = this.elements.getElement('card');
    if (existingElement) {
      return existingElement;
    }

    return this.elements.create('card', {
      // In order to make things quicker when home & billing postcodes are the same,
      // we always collect this outside the form (defaulting to home value where appropriate)
      // so can always hide it from the Stripe form. We pass in the value we collected in
      // `confirmCardPayment()` instead.
      hidePostalCode: true,
      iconStyle: 'solid',
      style: {
        base: {
          fontFamily: 'Maven Pro, sans-serif',
          fontSize: '2rem',
        },
      },
    });
  }
}
