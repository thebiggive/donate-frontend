import { Injectable } from '@angular/core';
import { Stripe, StripeCardElement, StripeElements, StripeError, Token } from '@stripe/stripe-js';
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

  // TODO try out loading via module for TS support.
  createCard(hidePostalCode: boolean): StripeCardElement | null {
    if (this.elements) {
      return this.elements.create('card', {
        hidePostalCode,
        iconStyle: 'solid',
        style: {
          base: {
            fontFamily: 'Maven Pro, sans-serif',
            fontSize: '2rem',
          },
        },
      });
    }

    console.log('Stripe Elements not ready');
    return null;
  }

  createToken(card: any): Promise<{ token?: Token | undefined, error?: StripeError | undefined }> | null {
    if (this.stripe) {
      return this.stripe.createToken(card);
    }

    console.log('Stripe Elements not ready');
    return null;
  }
}
