import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { AnalyticsProduct } from './analytics-product.model';
import { Campaign } from './campaign.model';
import { Donation } from './donation.model';
import { environment } from '../environments/environment';

declare var gtag: (...args: Array<string | { [key: string]: any }>) => void;

/**
 * Heavily inspired by https://stackoverflow.com/a/55222168/2803757
 */
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  /** Provides an efficient way to check whether we should be ignoring calls, e.g. because it's a server render. */
  private initialised = false;

  constructor(private router: Router) {}

  /**
   * For safely allowing in CSP.
   */
  static getConfigureContent() {
    return `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${environment.googleAnalyticsId}', {
        send_page_view: false,
        custom_map: {
          dimension2: 'psp',
          dimension3: 'gift_aid',
          dimension4: 'charity_campaign',
        }
      });
    `;
  }

  init() {
    const scriptInitGtag = document.createElement('script');
    scriptInitGtag.async = true;
    scriptInitGtag.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.googleAnalyticsId;
    document.head.appendChild(scriptInitGtag);

    const scriptConfigureGtag = document.createElement('script');
    scriptConfigureGtag.innerHTML = AnalyticsService.getConfigureContent();
    document.head.appendChild(scriptConfigureGtag);

    this.initialised = true;
    this.listenForRouteChanges();
  }

  logError(key: string, message: string) {
    this.sendEvent(key, {
      event_category: 'donate_error',
      event_label: message,
    });
  }

  logEvent(key: string, message: string) {
    this.sendEvent(key, {
      event_category: 'donate',
      event_label: message,
    });
  }

  logAmountChosen(amountChosen: number, campaignId: string, amountsSuggested?: number[]) {
    this.sendEvent(JSON.stringify(amountsSuggested), {
      event_category: 'donate_amount_chosen',
      event_label: `Donation to campaign ${campaignId}`,
      value: amountChosen,
    });
  }

  logCampaignProductImpression(campaign: Campaign) {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_product_detail_views
    this.callGtag('event', 'view_item', { items: [ this.buildProductData(campaign) ] });
  }

  logCampaignChosen(campaign: Campaign) {
    // tslint:disable-next-line max-line-length
    // https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_additions_to_and_removals_from_shopping_carts
    this.callGtag('event', 'add_to_cart', { items: [ this.buildProductData(campaign) ] });
  }

  /**
   * @param stepName  Following Enthuse convention stages are `checkout_option`s.
   *                      Order is: Select -> Details -> Confirm -> Pay.
   * @link https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#1_measure_checkout_steps
   */
  logCheckoutStep(step: number, campaign: Campaign, donation: Donation) {
    let stepName: string;
    switch (step) {
      case 1:
        stepName = 'Select';
        break;
      case 2:
        stepName = 'Details';
        break;
      case 3:
        stepName = 'Confirm';
        break;
      case 4:
      default:
        stepName = 'Pay';
    }

    if (step === 1) {
      this.callGtag('event', 'begin_checkout', { items: this.buildAllProductsData(campaign, donation) });
    }

    this.callGtag('event', 'checkout_progress', { items: this.buildAllProductsData(campaign, donation) });

    // Used for stages to match Enthuse convention for comparability.
    // https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#2_measure_checkout_options
    this.callGtag('event', 'set_checkout_option', {
      checkout_step: step,
      checkout_option: stepName,
    });
  }

  /**
   * @link https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_purchases
   */
  logCheckoutDone(campaign: Campaign, donation: Donation) {
    this.callGtag('event', 'purchase', {
      transaction_id: donation.donationId,
      value: donation.donationAmount + donation.tipAmount,
      currency: donation.currencyCode,
      items: this.buildAllProductsData(campaign, donation),
    });
  }

  buildAllProductsData(campaign: Campaign, donation: Donation): AnalyticsProduct[] {
    const products = [this.buildProductData(campaign, donation, false)];
    if (donation.tipAmount > 0) {
      products.push(this.buildProductData(campaign, donation, true));
    }

    return products;
  }

  private buildProductData(campaign: Campaign, donation?: Donation, tip?: boolean): AnalyticsProduct {
    return {
      brand: campaign.charity.name,
      category: `${campaign.matchFundsRemaining ? 'Matched' : 'Unmatched'} donations`,
      id: tip ? `${campaign.charity.id}-t` : `${campaign.charity.id}-${campaign.matchFundsRemaining > 0 ? 'm' : 'u'}-d`,
      name: tip ? 'Tip' : 'Donation',
      price: donation ? (tip ? donation.tipAmount : donation.donationAmount) : undefined,
      quantity: 1,
      variant: (donation && donation.giftAid !== null) ? (`${donation.giftAid ? 'With' : 'Without'} Gift Aid`) : undefined,

      // Custom dimensions – see 'config' call for setup.
      charity_campaign: campaign.title,
      gift_aid: (donation && donation.giftAid !== null) ? (donation.giftAid) : undefined,
      psp: donation?.psp || (campaign.charity.stripeAccountId ? 'stripe' : 'enthuse'),
    };
  }

  private sendEvent(eventName: string, params: { [key: string]: any }) {
    this.callGtag('event', eventName, params);
  }

  private listenForRouteChanges() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.callGtag('config', environment.googleAnalyticsId, {
          page_path: event.urlAfterRedirects,
          custom_map: {
            dimension2: 'psp',
            dimension3: 'gift_aid',
            dimension4: 'charity_campaign', // As opposed to GA campaign.
          },
        });
      }
    });
  }

  private callGtag(...args: Array<string | { [key: string]: any }>) {
    // Skip the call gracefully if on the server (don't want to double track router-based events),
    // or if loading fails or 3rd party JS is blocked (no usable `gtag`).
    if (this.initialised && globalThis.hasOwnProperty('gtag')) {
      gtag(...args);
    }
  }
}
