import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

import { AnalyticsService } from './analytics.service';
import { DonationService } from './donation.service';
import { GetSiteControlService } from './getsitecontrol.service';
import { StripeService } from './stripe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  navigating = false;

  constructor(
    private analyticsService: AnalyticsService,
    private donationService: DonationService,
    private getSiteControlService: GetSiteControlService,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private stripeService: StripeService,
  ) {
    // https://www.amadousall.com/angular-routing-how-to-display-a-loading-indicator-when-navigating-between-routes/
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.navigating = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.navigating = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsService.init();
      this.getSiteControlService.init();
      this.stripeService.init();
    }

    // This service needs to be injected app-wide and this line is here, because
    // we need to be sure the server-detected `COUNTY_CODE` InjectionToken is
    // always set up during the initial page load, regardless of whether the first
    // page the donor lands on makes wider use of DonationService or not.
    this.donationService.deriveDefaultCountry();
  }
}
