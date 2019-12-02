import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from '../environments/environment';

declare var gsc: (...args) => void;

/**
 * GetSiteControl JS is injected to provide social, cookie & feedback widgets.
 */
@Injectable({
  providedIn: 'root',
})
export class GetSiteControlService {

  constructor(private router: Router) {}

  init() {
    this.listenForRouteChanges();

    const scriptConfigureGSC = document.createElement('script');
    scriptConfigureGSC.innerHTML = `
      (function (w,i,d,g,e,t,s) {w[d] = w[d]||[];t= i.createElement(g);
        t.async=1;t.src=e;s=i.getElementsByTagName(g)[0];s.parentNode.insertBefore(t, s);
      })(window, document, '_gscq','script','//widgets.getsitecontrol.com/` + environment.getSiteControlId + `/script.js');

      window.gsc=window.gsc||function(){
        (gsc.q=gsc.q||[]).push(arguments)
      };
    `;
    document.head.appendChild(scriptConfigureGSC);
  }

  private listenForRouteChanges() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!gsc) {
          return; // Skip the call gracefully if loading fails or 3rd party JS is blocked.
        }

        gsc('trackPage', event.urlAfterRedirects);
      }
    });
  }
}
