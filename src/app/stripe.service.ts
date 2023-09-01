import {Injectable} from '@angular/core';
import {MatomoTracker} from 'ngx-matomo';
import {
  CanMakePaymentResult,
  loadStripe,
  PaymentIntentResult,
  PaymentMethod,
  PaymentMethodCreateParams,
  PaymentRequest,
  PaymentRequestItem,
  PaymentRequestPaymentMethodEvent,
  Stripe,
  StripeCardElement,
  StripeElements,
  StripePaymentRequestButtonElement,
} from '@stripe/stripe-js';
import {Observer} from 'rxjs';

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
    });
  }

  setLastCardMetadata(cardBrand?: string, cardCountry?: string) {
    this.lastCardBrand = cardBrand;
    this.lastCardCountry = cardCountry;
  }

  async confirmPaymentWithNewCardOrPRB(
    donationPreUpdate: Donation,
    cardElement: StripeCardElement,
  ): Promise<PaymentIntentResult | undefined> {
    if (!this.stripe || !donationPreUpdate.clientSecret || !donationPreUpdate.donationId) {
      console.log('Stripe not ready for confirmPayment()');
      return;
    }

    let paymentMethod: any;
    let isPrb = false;

    const billingDetails: PaymentMethodCreateParams.BillingDetails = {
      email: donationPreUpdate.emailAddress,
      name: `${donationPreUpdate.firstName} ${donationPreUpdate.lastName}` ?? undefined,
    };

    billingDetails.address = {
      country: donationPreUpdate.countryCode,
      postal_code: donationPreUpdate.billingPostalAddress, // Just postcode in the Stripe case.
    };

    // Ensure fee info is updated before finalising payment.
    return new Promise<PaymentIntentResult>((resolve, reject) => {
      this.donationService.updatePaymentDetails(donationPreUpdate, this.lastCardBrand, this.lastCardCountry)
      .subscribe(donation => {
        if (!donation.clientSecret || !donation.donationId) {
          reject('Missing ID in card-details-updated donation');
          return;
        }

        // Processing adapted from
        // https://stripe.com/docs/stripe-js/elements/payment-request-button?html-or-react=html#html-js-complete-payment
        // and card version merged with PRB one. More detailed comments on params
        // rationale there.
        if (this.paymentMethodIds.has(donation.donationId)) {
          isPrb = true;
          paymentMethod = this.paymentMethodIds.get(donation.donationId);
        } else {
          paymentMethod = {
            card: cardElement,
            // See https://stripe.com/docs/payments/accept-a-payment#web-submit-payment
            billing_details: billingDetails,
          };
        }

        let thePaymentMethodEvent = this.paymentMethodEvents.get(donation.donationId);

        this.payWithMethod(donation, paymentMethod, !isPrb).then(result => {
          if (thePaymentMethodEvent) {
            thePaymentMethodEvent.complete(result.error ? 'fail' : 'success');
          }

          resolve(result);
        }).catch(error => {
          if (thePaymentMethodEvent) {
            thePaymentMethodEvent.complete('fail');
          }

          reject(error);
        });
      });
    });
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

  getPaymentRequestButton(
      donation: Donation,
      elements: StripeElements,
      resultObserver: Observer<{billingDetails: PaymentMethod.BillingDetails | undefined, walletName: string}>,
  ): StripePaymentRequestButtonElement | null {
    if (!this.stripe) {
      console.log('Stripe not ready');
      return null;
    }

    if (this.paymentRequest) {
      this.paymentRequest.update({
        currency: donation.currencyCode.toLowerCase() || 'gbp',
        total: this.getPaymentRequestButtonTotal(donation),
        displayItems: this.getPaymentRequestButtonDisplayItems(donation),
      });
    } else {
      this.paymentRequest = this.stripe.paymentRequest({
        country: donation.countryCode || 'GB',
        currency: donation.currencyCode.toLowerCase() || 'gbp',
        total: this.getPaymentRequestButtonTotal(donation),
        displayItems: this.getPaymentRequestButtonDisplayItems(donation),
        requestPayerName: true,
        requestPayerEmail: true,
      });
    }

    // Always re-define the `on()` so that `resultObserver` is using the latest observer,
    // in the event that we re-created the PRB, and not trying to call back to a stale
    // element.
    this.paymentRequest.on('paymentmethod', (event: PaymentRequestPaymentMethodEvent) => {
      // Update fee details before confirming payment
      this.setLastCardMetadata(
          event.paymentMethod?.card?.brand,
          event.paymentMethod?.card?.country || 'N/A',
      );

      if (!donation.donationId) {
        event.complete('fail');
        console.log('No donation client secret to complete PaymentRequest');
        return;
      }

      this.paymentMethodEvents.set(donation.donationId, event);
      this.paymentMethodIds.set(donation.donationId, event.paymentMethod.id);

      // On success, let the page hide the card details & make 'Next' available.
      resultObserver.next({
        billingDetails: event.paymentMethod?.billing_details,
        walletName: event.walletName,
      });
    });

    const existingElement = elements.getElement('paymentRequestButton');
    if (existingElement) {
      return existingElement;
    }

    return elements.create('paymentRequestButton', {
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

  private getPaymentRequestButtonTotal(donation: Donation): PaymentRequestItem {
    let label = `Donation to ${donation.charityName}`;

    if (donation.tipAmount > 0) {
      label = `${label} and Big Give`;
    }

    if (donation.feeCoverAmount > 0) {
      label = `${label} and fee cover`;
    }

    return {
      label,
      // In pence/cents, inc. tip
      amount:
        parseInt((100 * donation.donationAmount).toString(), 10) +
        parseInt((100 * donation.tipAmount).toString(), 10) +
        parseInt((100 * donation.feeCoverAmount).toString(), 10),
    };
  }

  private getPaymentRequestButtonDisplayItems(donation: Donation): PaymentRequestItem[] | undefined {
    const items = [
      {
        amount: 100 * donation.donationAmount,
        label: `Donation to ${donation.charityName}`,
      },
    ];

    if (donation.tipAmount > 0) {
      items.push({
        amount: parseInt((100 * donation.tipAmount).toString(), 10),
        label: 'Donation to Big Give',
      });
    }

    if (donation.feeCoverAmount > 0) {
      items.push({
        amount: parseInt((100 * donation.feeCoverAmount).toString(), 10),
        label: 'Fee cover',
      });
    }

    return items;
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

    // const donorName = donation.firstName || '' + ' ' +  donation.lastName;

    // If we want to not show billing details inside the Stripe payment element we have to pass billing details
    // as payment_method_data here, with at least this much detail - but we don't collect addresses in that much detail.
    // const paymentMethodData = {
    //   billing_details:
    //     {
    //       name: donorName,
    //       address: {
    //         city: '',
    //         state: '',
    //         country: donation.countryCode,
    //         postal_code: donation.billingPostalAddress
    //       },
    //       email: donation.emailAddress,
    //       phone: ''
    //     }
    // };

    return await this.stripe?.confirmPayment({
      elements: elements,
      clientSecret: donation.clientSecret as string,
      redirect: 'if_required',
      confirmParams: {
        // payment_method_data: paymentMethodData,
        return_url: environment.donateGlobalUriPrefix + "/thanks/" + donation.donationId
      }
    });
  }
}
