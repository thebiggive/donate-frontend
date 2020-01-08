import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from '../environments/environment';

declare var gtag: (...args: Array<string | { [key: string]: any }>) => void;

/**
 * Heavily inspired by https://stackoverflow.com/a/55222168/2803757
 */
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  constructor(private router: Router) {}

  init() {
    this.listenForRouteChanges();

    const scriptInitGtag = document.createElement('script');
    scriptInitGtag.async = true;
    scriptInitGtag.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.googleAnalyticsId;
    document.head.appendChild(scriptInitGtag);

    const scriptConfigureGtag = document.createElement('script');
    scriptConfigureGtag.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '` + environment.googleAnalyticsId + `', {'send_page_view': false});
    `;
    document.head.appendChild(scriptConfigureGtag);
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

  private sendEvent(eventName: string, params: { [key: string]: any }) {
    if (!gtag) {
      return; // Skip the call gracefully if loading fails or 3rd party JS is blocked.
    }

    gtag('event', eventName, params);
  }

  private listenForRouteChanges() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!gtag) {
          return; // Skip the call gracefully if loading fails or 3rd party JS is blocked.
        }

        gtag('config', environment.googleAnalyticsId, {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }
}
