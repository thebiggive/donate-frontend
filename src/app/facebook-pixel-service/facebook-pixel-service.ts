import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FacebookPixelService {
  private loadOk = false;

  constructor() {}

  load() {
    if (!this.loadOk) {
      (function(f: any, b, e, v, n, t, s) {
        if (f.fbq) {
          return;
        }
        n = f.fbq = function() {
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
      (window as any).fbq('init', '272508403759002');
      (window as any).fbq('track', 'PageView');
      this.loadOk = true;
      console.log('Facebook pixel init run!');
    } else {
      (window as any).fbq('track', 'PageView');
      console.log('Facebook PageView event fired!');
    }
  }
}
