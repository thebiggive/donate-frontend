import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  Event,
  NavigationEnd,
  Router,
} from '@angular/router';

import { AnalyticsService } from './analytics.service';
import { DonationService } from './donation.service';
import { GetSiteControlService } from './getsitecontrol.service';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public fontsLoaded = false;

  constructor(
    private analyticsService: AnalyticsService,
    private donationService: DonationService,
    private getSiteControlService: GetSiteControlService,
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {
    // https://www.amadousall.com/angular-routing-how-to-display-a-loading-indicator-when-navigating-between-routes/
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          this.navigationService.saveNewUrl(event.urlAfterRedirects);
        }
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsService.init();
      this.getSiteControlService.init();

      this.fontsLoaded = false;
      globalThis.document.fonts.ready.then(() => this.fontsLoaded = true);
    } else {
      // Server renders shouldn't hide elements regardless of this.
      this.fontsLoaded = true;
    }

    // This service needs to be injected app-wide and this line is here, because
    // we need to be sure the server-detected `COUNTY_CODE` InjectionToken is
    // always set up during the initial page load, regardless of whether the first
    // page the donor lands on makes wider use of DonationService or not.
    this.donationService.deriveDefaultCountry();
  }
}
