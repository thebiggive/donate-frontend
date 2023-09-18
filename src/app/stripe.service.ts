import {Injectable} from '@angular/core';
import {MatomoTracker} from 'ngx-matomo';
import {
    CanMakePaymentResult,
    loadStripe,
    PaymentIntentResult,
    PaymentMethod,
    PaymentRequest,
    PaymentRequestPaymentMethodEvent,
    Stripe,
    StripeElements,
} from '@stripe/stripe-js';

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
  private paymentRequest: PaymentRequest;
  private stripe: Stripe | null;
  private paymentMethodEvents: Map<string, PaymentRequestPaymentMethodEvent>;
  private paymentMethodIds: Map<string, string>; // Donation ID to payment method ID.

  constructor(
    private donationService: DonationService,
    private matomoTracker: MatomoTracker,
  ) {}

  async init() {
    if (this.didInit) {
      return;
    }

    this.didInit = true;

    this.paymentMethodEvents = new Map();
    this.paymentMethodIds = new Map();

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

  async confirmPaymentWithSavedMethod(
    donationPreUpdate: Donation,
    paymentMethod: PaymentMethod
  ): Promise<PaymentIntentResult | undefined> {
    return new Promise<PaymentIntentResult>((resolve, reject) => {
      this.setLastCardMetadata(paymentMethod.card?.brand, paymentMethod.card?.country as string);

      this.donationService.updatePaymentDetails(donationPreUpdate, this.lastCardBrand, this.lastCardCountry)
        .subscribe(donation => {
          if (!donation.clientSecret || !donation.donationId) {
            reject('Missing ID in card-details-updated donation');
            return;
          }

          this.payWithMethod(
            donation,
            paymentMethod.id, // Sending the full object for completion means properties like "customer" crash the callout.
            true, // Never a *new* PRB (wallet) when the method is saved, so always handle actions.
          ).then(result => {
            resolve(result);
          }).catch(error => {
            reject(error);
          });
        });
    });
  }

  canUsePaymentRequest(): Promise<CanMakePaymentResult|null> {
    return this.paymentRequest.canMakePayment();
  }

  private payWithMethod(donation: Donation, payment_method: any, handleActions: boolean): Promise<PaymentIntentResult> {
    return new Promise((resolve) => {
      this.stripe?.confirmCardPayment(
        donation.clientSecret as string,
        { payment_method },
        { handleActions },
      ).then(async confirmResult => {
        const analyticsEventActionPrefix = handleActions ? 'stripe_card_' : 'stripe_prb_';

        if (confirmResult.error) {
          // Failure w/ no extra action applicable
          this.matomoTracker.trackEvent(
            'donate_error',
            `${analyticsEventActionPrefix}payment_error`,
            confirmResult.error.message ?? '[No message]',
          );

          if (donation.donationId) {
            // Ensure we don't try to re-use the same payment method, as with PRBs it seemingly gets "disconnected"
            // from the Customer and retries fail.
            this.paymentMethodIds.delete(donation.donationId);
          }

          resolve(confirmResult);
          return;
        }

        if (confirmResult.paymentIntent.status !== 'requires_action') {
          // Success w/ no extra action needed
          this.matomoTracker.trackEvent(
            'donate',
            `${analyticsEventActionPrefix}payment_success`,
            `Stripe Intent processing or done for donation ${donation.donationId} to campaign ${donation.projectId}`,
          );

          resolve(confirmResult);
          return;
        }

        // The PaymentIntent requires an action e.g. 3DS verification; let Stripe.js handle the flow.
        this.matomoTracker.trackEvent(
          'donate',
          `${analyticsEventActionPrefix}requires_action`,
          confirmResult.paymentIntent.next_action?.type ?? '[Action unknown]',
        );
        this.stripe?.confirmCardPayment(donation.clientSecret || '').then(confirmAgainResult => {
          if (confirmAgainResult.error) {
            if (donation.donationId) {
              this.paymentMethodIds.delete(donation.donationId); // As above
            }
            this.matomoTracker.trackEvent(
              'donate_error',
              `${analyticsEventActionPrefix}further_action_error`,
              confirmAgainResult.error.message ?? '[No message]',
            );
          }

          // Extra action done, whether successfully or not.
          resolve(confirmAgainResult);
        });
      });
    });
  }

  async confirmPaymentWithPaymentElement(donation: Donation, elements: StripeElements): Promise<PaymentIntentResult | undefined>
  {
    const {error: submitError} = await elements.submit();
    if (submitError) {
      console.error(submitError); // @todo handle this error better.
      return;
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

    return await this.stripe?.confirmPayment({
      elements: elements,
      clientSecret: donation.clientSecret as string,
      redirect: 'if_required',
      confirmParams: {
        payment_method_data: paymentMethodData,
        return_url: environment.donateGlobalUriPrefix + "/thanks/" + donation.donationId
      }
    });
  }
}
