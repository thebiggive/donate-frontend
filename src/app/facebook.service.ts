import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacebookService {
  constructor() {}

  init() {
    this.facebookJS();
  }

  /**
   * Inspired by https://stackoverflow.com/a/58120781/2803757
   */
  private facebookJS() {
    ((f: any, b?: any, e?: any, v?: any, n?: any, t?: any, s?: any) => {
      if (f.fbq) {
        return;
      }
      n = f.fbq = () => {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) {
        f._fbq = n;
      }
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js',
    );
    (window as any).fbq('init', environment.facebookPixelId);
    (window as any).fbq('track', 'PageView');
  }
}
