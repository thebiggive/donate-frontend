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

  /**
   * For safely allowing in CSP.
   */
  static getOptimizeAntiFlickerScript() {
    return `
      (function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
      h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
      (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
      })(window,document.documentElement,'async-hide','dataLayer',4000,
      {'${environment.googleOptimizeId}':true});
    `;
  }

  init() {
    if (environment.googleOptimizeId) {
      const optimizeAntiFlickerStyle = document.createElement('style');
      optimizeAntiFlickerStyle.innerHTML = '.async-hide { opacity: 0 !important}';
      document.head.appendChild(optimizeAntiFlickerStyle);

      const optimizeAntiFlickerScript = document.createElement('script');
      optimizeAntiFlickerScript.innerHTML = AnalyticsService.getOptimizeAntiFlickerScript();
      document.head.appendChild(optimizeAntiFlickerScript);

      const optimizeTag = document.createElement('script');
      optimizeTag.async = true;
      optimizeTag.src = `https://www.googleoptimize.com/optimize.js?id=${environment.googleOptimizeId}`;
      document.head.appendChild(optimizeTag);
    }

    const scriptInitGtag = document.createElement('script');
    scriptInitGtag.async = true;
    scriptInitGtag.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsId}`;
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

  logAmountChosen(amountChosen: number, campaignId: string, amountsSuggested: number[], currencyCode: string) {
    this.sendEvent(JSON.stringify(amountsSuggested), {
      event_category: `donate_amount_chosen_${currencyCode}`,
      event_label: `Donation to campaign ${campaignId}`,
      value: amountChosen,
    });
  }

  logTipAmountChosen(tipAmountChosen: number, campaignId: string, currencyCode: string) {
    this.sendEvent('Tip included', {
      event_category: `tip_amount_chosen_${currencyCode}`,
      event_label: `Tip alongside donation to campaign ${campaignId}`,
      // Note this is in PENCE as tips are more often fractional. To enable historic comparison, and because
      // only whole numbers are allowed for donation amount, `donate_amount_chosen_GBP` and friends remain
      // in POUNDS.
      value: 100 * tipAmountChosen,
    });
  }

  logCampaignProductImpression(campaign: Campaign) {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_product_detail_views
    this.callGtag('event', 'view_item', { items: [ this.buildProductData(campaign) ] });
  }

  logCampaignChosen(campaign: Campaign) {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_additions_to_and_removals_from_shopping_carts
    this.callGtag('event', 'add_to_cart', { items: [ this.buildProductData(campaign) ] });
  }

  /**
   * @param {number} step Following stages are used for checkout for comparability to
   *                          old stages.
   *                          1 > Select – used to mean an amount was chosen
   *                          2 > Details – used to mean Payment Details and, if applicable, Gift
   *                                          Aid status are set
   *                          3 > Confirm – used when comms choices (Receive updates) done
   *                          4 > Pay     – payment finalised
   * @link https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#1_measure_checkout_steps
   */
  logCheckoutStep(step: number, campaign: Campaign, donation: Donation) {
    const items = this.buildAllProductsData(campaign, donation);

    if (step === 1) {
      this.callGtag('event', 'begin_checkout', { items });
      return;
    }

    this.callGtag('event', 'checkout_progress', {
      checkout_step: step,
      items: this.buildAllProductsData(campaign, donation),
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
    } else if (donation.feeCoverAmount > 0) {
      products.push(this.buildProductData(campaign, donation, false, true));
    }

    return products;
  }

  private buildProductData(campaign: Campaign, donation?: Donation, tip?: boolean, feeCover?: boolean): AnalyticsProduct {
    let price;
    let name = 'Donation';

    if (donation) {
      price = donation.donationAmount;

      if (tip) {
        price = donation?.tipAmount;
        name = 'Tip';
      } else if (feeCover) {
        price = donation?.feeCoverAmount;
        name = 'Fee cover';
      }
    }

    return {
      brand: campaign.charity.name,
      category: `${campaign.matchFundsRemaining ? 'Matched' : 'Unmatched'} donations`,
      id: tip ? `${campaign.charity.id}-t` : `${campaign.charity.id}-${campaign.matchFundsRemaining > 0 ? 'm' : 'u'}-d`,
      name,
      price,
      quantity: 1,
      variant: (donation && donation.giftAid !== null) ? (`${donation.giftAid ? 'With' : 'Without'} Gift Aid`) : undefined,

      // Custom dimensions – see 'config' call for setup.
      charity_campaign: campaign.title,
      gift_aid: (donation && donation.giftAid !== null) ? (donation.giftAid) : undefined,
      psp: donation?.psp || 'stripe',
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

  /**
   * Safely relay data to `dataLayer.push()` iff appropriate.
   */
  private callGtag(...args: Array<string | { [key: string]: any }>) {
    // Skip the call gracefully if on the server (don't want to double track router-based events),
    // or if loading fails or 3rd party JS is blocked (no usable `gtag`).
    if (this.initialised && globalThis.hasOwnProperty('gtag')) {
      gtag(...args);
    }
  }
}
