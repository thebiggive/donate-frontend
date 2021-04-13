import { Injectable } from '@angular/core';
import {
  CanMakePaymentResult,
  loadStripe,
  PaymentMethod,
  PaymentIntent,
  PaymentMethodCreateParams,
  PaymentRequest,
  Stripe,
  StripeCardElement,
  StripeElements,
  StripeError,
  StripePaymentRequestButtonElement,
} from '@stripe/stripe-js';
import { Observer } from 'rxjs';

import { AnalyticsService } from './analytics.service';
import { environment } from '../environments/environment';
import { Donation } from './donation.model';
import { DonationService } from './donation.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private elements: StripeElements;
  private paymentRequest: PaymentRequest;
  private stripe: Stripe | null;

  constructor(
    private analyticsService: AnalyticsService,
    private donationService: DonationService,
  ) {}

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

  async createPaymentMethod(
    cardElement: StripeCardElement,
    donorName?: string,
  ): Promise<{paymentMethod?: PaymentMethod; error?: StripeError}> {
    if (!this.stripe) {
      console.log('Stripe not ready');
      return {};
    }

    // See https://stripe.com/docs/js/payment_methods
    const result = await this.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: donorName,
      },
    });
    return result;
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

  getCard(): StripeCardElement | null {
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
          fontSize: '14px',
        },
      },
    });
  }

  getPaymentRequestButton(donation: Donation, resultObserver: Observer<boolean>): StripePaymentRequestButtonElement | null {
    if (!this.elements || !this.stripe) {
      console.log('Stripe Elements not ready');
      return null;
    }

    this.paymentRequest = this.stripe.paymentRequest({
      country: donation.countryCode || 'GB',
      currency: donation.currencyCode.toLowerCase() || 'gbp',
      total: {
        label: `Donation to ${donation.charityName}`,
        // In pence/cents
        amount: 100 * donation.donationAmount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    this.paymentRequest.on('paymentmethod', event => {
      // Update fee details before confirming payment
      this.donationService.updatePaymentDetails(
        donation,
        event.paymentMethod?.card?.brand,
        event.paymentMethod?.card?.country || 'N/A',
      ).subscribe(() => {
        if (!donation.clientSecret) {
          console.log('No donation client secret to complete PaymentRequest');
          return;
        }

        // Processing adapted from
        // https://stripe.com/docs/stripe-js/elements/payment-request-button?html-or-react=html#html-js-complete-payment
        // - more detailed comments on params rationale there.
        this.stripe?.confirmCardPayment(
          donation.clientSecret,
          { payment_method: event.paymentMethod.id },
          { handleActions: false },
        ).then(confirmResult => {
          if (confirmResult.error) {
            // Failure w/ no extra action applicable
            this.analyticsService.logError('stripe_prb_confirm_error', confirmResult.error.message ?? '[No message]');

            resultObserver.next(false);
            event.complete('fail');
          } else {
            event.complete('success');
            // Check if the PaymentIntent requires any actions and if so let Stripe.js
            // handle the flow.
            if (confirmResult.paymentIntent.status === 'requires_action') {
              this.analyticsService.logEvent('stripe_prb_requires_action', confirmResult.paymentIntent.next_action?.type ?? '[Action unknown]');

              this.stripe?.confirmCardPayment(donation.clientSecret || '').then(result => {
                if (result.error) {
                  this.analyticsService.logError('stripe_prb_further_action_error', result.error.message ?? '[No message]');
                }

                // Extra action done – resolve with success/failure boolean
                resultObserver.next(!result.error);
              });
            } else {
              // Success w/ no extra action needed
              resultObserver.next(true);
            }
          }
        });
      });
    });

    const existingElement = this.elements.getElement('paymentRequestButton');
    if (existingElement) {
      return existingElement;
    }

    return this.elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
      style: {
        paymentRequestButton: {
          type: 'donate',
        },
      },
    });
  }

  canUsePaymentRequest(): Promise<CanMakePaymentResult|null> {
    return this.paymentRequest.canMakePayment();
  }
}
