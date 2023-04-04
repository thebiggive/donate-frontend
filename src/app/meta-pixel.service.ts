import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from '../environments/environment';

declare const fbq: (action: string, eventOrId: string, params?: object) => void;

@Injectable({
  providedIn: 'root',
})
export class MetaPixelService {
  constructor(private router: Router) {}

  init() {
    if (!environment.metaPixelId) {
      return;
    }

    this.listenForRouteChanges();

    const scriptInitMetaPixel = document.createElement('script');
    scriptInitMetaPixel.setAttribute('nonce', 'OT22mYwcUVPp');
    scriptInitMetaPixel.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '` + environment.metaPixelId + `');
    `;
    document.head.appendChild(scriptInitMetaPixel);
  }

  trackConversion(amount: number) {
    if (!fbq) {
      return; // Skip the call gracefully if loading fails or 3rd party JS is blocked.
    }

    fbq('track', 'Donate', {value: amount, currency: 'GBP'});
  }

  private listenForRouteChanges() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!fbq) {
          return; // Skip the call gracefully if loading fails or 3rd party JS is blocked.
        }

        fbq('track', 'PageView');
      }
    });
  }
}
