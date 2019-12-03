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

    const scriptInitGSC = document.createElement('script');
    scriptInitGSC.async = true;
    scriptInitGSC.src = `https://widgets.getsitecontrol.com/${environment.getSiteControlId}/script.js`;
    document.head.appendChild(scriptInitGSC);

    const scriptConfigureGSC = document.createElement('script');
    scriptConfigureGSC.innerHTML = `
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
