import { Injectable } from '@angular/core';
import {
  ConfirmationTokenResult,
  CustomFontSource,
  loadStripe,
  SetupIntentResult,
  Stripe,
  StripeElements,
  StripeElementsOptionsMode,
  StripeError,
  StripePaymentElement,
} from '@stripe/stripe-js';

import { environment } from '../environments/environment';
import { environment as stagingEnvironment } from '../environments/environment.staging';
import { Donation } from './donation.model';
import { Campaign } from './campaign.model';
import { countryISO2 } from './countries';
import { bigGiveName } from '../environments/common';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private didInit = false;
  private stripe?: Stripe | null;

  private readonly fonts: CustomFontSource[];

  private readonly appearance = {
    theme: 'flat',
    variables: {
      fontFamily: '"Euclid Triangle", sans-serif',
      fontLineHeight: '1.5',
      borderRadius: '0',
      colorPrimary: '#2C089B', // matches our $colour-primary
      colorBackground: '#F6F6F6', // matches our $colour-background
      colorDanger: '#bb2222', // matches angular native and our snackbar
      accessibleColorOnColorPrimary: '#262626',
      focusOutline: '1px solid #FF7272', // matches our $colour-tertiary-coral
    },
    rules: {
      '.Block': {
        backgroundColor: 'var(--colorBackground)',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
        padding: '12px',
      },
      '.Input': {
        padding: '12px',
        border: 'solid 1px #8A8A8A', // matches our $colour-grey-medium
      },
      '.Input:disabled, .Input--invalid:disabled': {
        color: 'lightgray',
      },
      '.Tab': {
        padding: '10px 12px 8px 12px',
        backgroundColor: '#fff',
        transition: 'background .15s ease, outline .15s ease, box-shadow .15s ease',
      },
      '.Tab:hover': {
        backgroundColor: '#fff',
      },
      '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
        backgroundColor: '#fff',
        outline: '2px solid #FF7272',
      },
      '.TabIcon--selected': {
        fill: '#FF7272', // icon is SVG so only fill has effect, but leaving in color too for good measure
        color: '#FF7272', // and in case Stripe introduces a text element here in future.
      },
      '.CheckboxInput, .CheckboxInput--checked': {
        backgroundColor: 'inherit',
        outline: 'solid 1px black',
      },
      '.Label, .CheckboxLabel': {
        fontWeight: '500',
        color: '#2C089B', // matches our $colour-primary
      },
      '.PickerItem': {
        outline: '1px solid #8A8A8A',
      },
      '.PickerItem--highlight': {
        outline: '1px solid #FF7272',
      },
      '.PickerItem--selected': {
        outline: 'none',
      },
      '.PickerItem--highlight, .PickerItem--highlight:hover': {
        boxShadow: 'none',
      },
      '.PickerItem:hover, .PickerItem--highlight:hover': {
        boxShadow: '0 0 1px rgba(0,0,0,.15), 0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.03)',
      },
    },
  } as const;

  public constructor() {
    let fontOrigin: string = environment.donateUriPrefix;

    if (environment.environmentId === 'development') {
      // Stripe can't fetch the font from local dev env, so we use the staging URL instead.
      fontOrigin = stagingEnvironment.donateUriPrefix;
    }

    this.fonts = [
      {
        family: 'Euclid Triangle',
        src: `url('${fontOrigin}/d/EuclidTriangle-Regular.1d45abfd25720872.woff2') format('woff2')`,
        display: 'swap',
        weight: '400',
      },
    ];
  }

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

  public stripeElementsForDonation(
    donation: Donation,
    campaign: Campaign,
    customerSessionClientSecret: string | undefined,
  ) {
    if (!this.stripe) {
      throw new Error('Stripe not ready');
    }

    const money = {
      currency: donation.currencyCode,
      amount: this.amountIncTipInMinorUnit(donation),
    };

    return this.stripeElements({
      money: money,

      // future usage is up to the donor to decide by ticking "Save payment details for future purchases" inside
      // the iframe or not.
      futureUsage: null,
      campaign: campaign,
      customerSessionClientSecret: customerSessionClientSecret,
    });
  }

  /**
   *
   * @param money - amount must be in minor units
   */
  public stripeElements({
    money,
    futureUsage,
    campaign,
    customerSessionClientSecret,
  }: {
    money: { currency: string; amount: number };
    futureUsage: 'off_session' | null;
    campaign: Campaign;
    customerSessionClientSecret: string | undefined;
  }) {
    if (!this.stripe) {
      throw new Error('Stripe not ready');
    }

    const elementOptions: StripeElementsOptionsMode = {
      fonts: this.fonts,
      appearance: this.appearance,
      mode: 'payment',
      amount: money.amount,
      currency: money.currency.toLowerCase(),
      setupFutureUsage: futureUsage,
      on_behalf_of: campaign.charity.stripeAccountId,
      paymentMethodCreation: 'manual',
      customerSessionClientSecret,
    };

    return this.stripe.elements(elementOptions);
  }

  updateAmount(elements: StripeElements, donation: Donation) {
    elements.update({ amount: this.amountIncTipInMinorUnit(donation) });
  }

  async prepareConfirmationTokenFromPaymentElement(
    { countryCode, billingPostalAddress }: { countryCode: string; billingPostalAddress: string },
    elements: StripeElements,
  ): Promise<ConfirmationTokenResult> {
    if (!this.stripe) {
      throw new Error('Stripe not ready');
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      return { error: submitError, confirmationToken: undefined };
    }

    // If we want to not show billing details inside the Stripe payment element we have to pass billing details
    // as `params.billing_details` here.
    const paymentMethodData = {
      billing_details: {
        address: {
          country: countryCode,
          postal_code: billingPostalAddress,
        },
      },
    };

    return await this.stripe.createConfirmationToken({
      elements: elements,
      params: { payment_method_data: paymentMethodData },
    });
  }

  public static createStripeElement(stripeElements: StripeElements) {
    return stripeElements.create('payment', {
      wallets: {
        applePay: 'auto',
        googlePay: 'auto',
      },
      terms: {
        // We have our own terms copy for the future payment in donation-start-form.component.html
        card: 'never',
        applePay: 'never',
        googlePay: 'never',
      },
      fields: {
        billingDetails: {
          address: {
            // We have our own input fields for country and postal code - we will pass these to stripe on payment confirmation.
            country: 'never',
            postalCode: 'never',
          },
        },
      },
      business: { name: bigGiveName },
    });
  }

  async handleNextAction(clientSecret: string) {
    if (!this.stripe) {
      throw new Error('Stripe not ready');
    }

    return await this.stripe.handleNextAction({
      clientSecret: clientSecret,
    });
  }

  private amountIncTipInMinorUnit(donation: Donation) {
    // use round not floor to avoid issues like returning 114 as the sum of £1 and £0.15
    return Math.round((donation.tipAmount + donation.donationAmount) * 100);
  }

  public stripeElementsForRegularGivingPaymentMethod(client_secret: string): [StripeElements, StripePaymentElement] {
    const elements = this.stripe!.elements({
      clientSecret: client_secret,
      appearance: this.appearance,
      fonts: this.fonts,
    });

    return [elements, StripeService.createStripeElement(elements)];
  }

  public async confirmSetup({
    stripeElements,
    return_url,
    billingCountryCode,
    billingPostalCode,
  }: {
    billingCountryCode: countryISO2;
    billingPostalCode: string;
    stripeElements: StripeElements;
    return_url: string;
  }): Promise<SetupIntentResult> {
    if (!this.stripe) {
      throw new Error('Stripe not ready');
    }

    return await this.stripe.confirmSetup({
      confirmParams: {
        return_url,
        payment_method_data: {
          billing_details: {
            address: {
              country: billingCountryCode.toLowerCase(),
              postal_code: billingPostalCode,
            },
          },
        },
      },
      elements: stripeElements,
      redirect: 'if_required',
    });
  }
}

export function getStripeFriendlyError(
  error: StripeError | { message: string; code: string; decline_code?: string; description?: string } | undefined,
  context: 'method_setup' | 'card_change' | 'confirm',
): string {
  let prefix = '';
  switch (context) {
    case 'method_setup':
      prefix = 'Payment setup failed: ';
      break;
    case 'card_change':
      prefix = 'Payment method update failed: ';
      break;
    case 'confirm':
      prefix = 'Payment processing failed: ';
  }

  if (!error || (!error.message && !error.code)) {
    if (error && Object.prototype.hasOwnProperty.call(error, 'description')) {
      // not sure why TS doesn't recognise that it must have a description because I just checked
      // with hasOwnProperty.
      // @ts-expect-error Property description does not exist on type
      return `${prefix}${error!.description}`;
    }
    return `${prefix}Sorry, we encountered an error. Please try again in a moment or contact us if this message persists.`;
  }

  let friendlyError = error.message;

  let customMessage = false;
  if (error.code === 'card_declined' && error.decline_code === 'generic_decline') {
    // Probably a custom Radar rule -> relatively likely to be an incorrect postcode.
    friendlyError = `The payment was declined. Please ensure details provided (including postcode) match your card. Contact your bank or hello@biggive.org if the problem persists.`;
    customMessage = true;
  }

  if (error.code === 'card_declined' && error.decline_code === 'invalid_amount') {
    // We've seen e.g. HSBC in Nov '23 decline large donations with this code.
    friendlyError =
      'The payment was declined. You might need to contact your bank before making a donation of this amount.';
    customMessage = true;
  }

  if (customMessage && context === 'confirm') {
    prefix = ''; // Don't show extra context info in the most common `context`, when showing our already-long custom copy.
  }

  return `${prefix}${friendlyError}`;
}
