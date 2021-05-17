import { Injectable } from '@angular/core';
import {
  CanMakePaymentResult,
  loadStripe,
  PaymentIntentResult,
  PaymentMethod,
  PaymentRequestPaymentMethodEvent,
  PaymentMethodCreateParams,
  PaymentRequest,
  Stripe,
  StripeCardElement,
  StripeElements,
  StripeError,
  StripePaymentRequestButtonElement,
  PaymentRequestCompleteStatus,
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
  private paymentMethodIds = new Map<string, string>(); // Donation ID to payment method ID.
  private paymentMethodCallbacks: Map<string, (status: PaymentRequestCompleteStatus) => void>;

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

  async confirmPayment(
    donation: Donation,
    cardElement: StripeCardElement,
  ): Promise<PaymentIntentResult | undefined> {
    if (!this.stripe || !donation.clientSecret || !donation.donationId) {
      console.log('Stripe not ready for confirmPayment()');
      return;
    }

    const billingDetails: PaymentMethodCreateParams.BillingDetails = {
      email: donation.emailAddress,
      name: `${donation.firstName} {donation.lastName}` ?? undefined,
    };

    billingDetails.address = {
      country: donation.countryCode,
      postal_code: donation.billingPostalAddress, // Just postcode in the Stripe case.
    };

    // Processing adapted from
    // https://stripe.com/docs/stripe-js/elements/payment-request-button?html-or-react=html#html-js-complete-payment
    // and card version merged with PRB one. More detailed comments on params
    // rationale there.
    let paymentMethod: any;
    let prbComplete: any;
    if (this.paymentMethodIds.has(donation.donationId)) {
      prbComplete = this.paymentMethodCallbacks.get(donation.donationId);
      paymentMethod = this.paymentMethodIds.get(donation.donationId);
    } else {
      paymentMethod = {
        card: cardElement,
        // See https://stripe.com/docs/payments/accept-a-payment#web-submit-payment
        billing_details: billingDetails,
      };
    }

    return await this.stripe?.confirmCardPayment(
      donation.clientSecret,
      { payment_method: paymentMethod },
      { handleActions: false },
    ).then(async confirmResult => {
      if (confirmResult.error) {
        // Failure w/ no extra action applicable
        // TODO update log event names to not be PRB-specific *or* set up a dynamic
        // pair of events for each.
        this.analyticsService.logError('stripe_prb_confirm_error', confirmResult.error.message ?? '[No message]');

        if (prbComplete) {
          prbComplete('fail');
        }

        return confirmResult;
      }

      if (confirmResult.paymentIntent.status !== 'requires_action') {
        // Success w/ no extra action needed
        if (prbComplete) {
          prbComplete('success');
        }

        return confirmResult;
      }

      // The PaymentIntent requires an action e.g. 3DS verification; let Stripe.js handle the flow.
      this.analyticsService.logEvent('stripe_prb_requires_action', confirmResult.paymentIntent.next_action?.type ?? '[Action unknown]');
      return await this.stripe?.confirmCardPayment(donation.clientSecret || '').then(confirmAgainResult => {
        if (confirmAgainResult.error) {
          this.analyticsService.logError('stripe_prb_further_action_error', confirmAgainResult.error.message ?? '[No message]');
        }

        // Extra action done, whether successfully or not.
        if (prbComplete) {
          prbComplete(confirmAgainResult.error ? 'fail' : 'success');
        }

        return confirmAgainResult;
      });
    });
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
        // In pence/cents, inc. tip
        amount: (100 * donation.donationAmount) + (100 * donation.tipAmount),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    this.paymentRequest.on('paymentmethod', (event: PaymentRequestPaymentMethodEvent) => {
      // Update fee details before confirming payment

      // TODO check if this is sufficient to keep the new
      // brand/country on subsequent calls – are we updating the local copy?
      this.donationService.updatePaymentDetails(
        donation,
        event.paymentMethod?.card?.brand,
        event.paymentMethod?.card?.country || 'N/A',
      ).subscribe(() => {
        if (!donation.clientSecret || !donation.donationId) {
          console.log('No donation client secret to complete PaymentRequest');
          return;
        }

        this.paymentMethodIds.set(donation.donationId, event.paymentMethod.id);
        this.paymentMethodCallbacks.set(donation.donationId, event.complete);
        resultObserver.next(true); // Let the page hard the card details & make 'Next' available.
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
