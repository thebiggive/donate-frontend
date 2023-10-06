import {APP_BASE_HREF, isPlatformBrowser} from '@angular/common';
import {AfterViewInit, Component, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {Event as RouterEvent, NavigationEnd, NavigationStart, Router,} from '@angular/router';
import {BiggiveMainMenu} from '@biggive/components-angular';
import {MatomoTracker} from "ngx-matomo";
import {filter} from 'rxjs/operators';

import {DonationService} from './donation.service';
import {GetSiteControlService} from './getsitecontrol.service';
import {NavigationService} from './navigation.service';
import {Person} from "./person.model";
import {IdentityService} from "./identity.service";
import {environment} from "../environments/environment";
import {flags} from "./featureFlags";
import {
  agreesToAnalyticsAndTracking,
  agreesToThirdParty,
  CookiePreferences,
  CookiePreferenceService
} from "./cookiePreference.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild(BiggiveMainMenu) header: BiggiveMainMenu;

  public isLoggedIn: boolean = false;

  public readonly donateUriPrefix = environment.donateGlobalUriPrefix;
  public readonly blogUriPrefix = environment.blogUriPrefix

  public readonly experienceUriPrefix = environment.experienceUriPrefix;

  public isDataLoaded = false;

  protected readonly environment = environment;
  protected readonly flags = flags;
  protected readonly userHasExpressedCookiePreference$ = this.cookiePreferenceService.userHasExpressedCookiePreference();
  public currentUrl: URL;

  constructor(
    private identityService: IdentityService,
    @Inject(APP_BASE_HREF) private baseHref: string,
    private donationService: DonationService,
    private getSiteControlService: GetSiteControlService,
    private navigationService: NavigationService,
    private cookiePreferenceService: CookiePreferenceService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private matomoTracker: MatomoTracker,
    private router: Router,
  ) {
    // https://www.amadousall.com/angular-routing-how-to-display-a-loading-indicator-when-navigating-between-routes/
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          this.navigationService.saveNewUrl(event.urlAfterRedirects);
        }
      }
    });

    this.currentUrl = new URL(environment.donateGlobalUriPrefix + router.url);
  }

  /**
   * Component library's `<biggive-button/>`, which is also part of composed components like
   * `<biggive-campaign-card/>`, emits this custom event on click. This lets us swap in the
   * smoother in-app Angular routing for internal links automatically, without complicating the
   * input to the buttons.
   */
  @HostListener('doButtonClick', ['$event']) onDoButtonClick(event: CustomEvent) {
    const url = event.detail.url;

    if (url.startsWith(this.baseHref)) {
      event.detail.event.preventDefault();
      this.router.navigateByUrl(url.replace(this.baseHref, ''));
    } // Else fall back to normal link behaviour
  }

  public isPlatformBrowser = isPlatformBrowser(this.platformId);

  ngOnInit() {
    if (this.isPlatformBrowser) {
      this.cookiePreferenceService.userOptInToSomeCookies().subscribe((preferences: CookiePreferences) => {
        if (agreesToThirdParty(preferences)) {
          this.getSiteControlService.init();
        }

        if (agreesToAnalyticsAndTracking(preferences)) {
          this.matomoTracker.setCookieConsentGiven();
        }
      });

      // Temporarily client-side redirect the previous non-global domain to the new one.
      // Once most inbound links are updated, we can probably replace the app redirect
      // with an infrastructure-level one a la parked domains.
      if (window.location.host === 'donate.thebiggive.org.uk') {
        window.location.host = 'donate.biggive.org';
      }
    }

    // This service needs to be injected app-wide and this line is here, because
    // we need to be sure the server-detected `COUNTY_CODE` InjectionToken is
    // always set up during the initial page load, regardless of whether the first
    // page the donor lands on makes wider use of DonationService or not.
    this.donationService.deriveDefaultCountry();

    this.identityService.getLoggedInPerson().subscribe((person: Person|null) => {
      this.isLoggedIn = !! person && !! person.has_password;

      this.isDataLoaded = true;

      this.identityService.onJWTModified(() => {
        this.ngOnInit()
      });
    });
  }

  ngAfterViewInit() {
    const headerEl = this.header;
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
    ).subscribe(() => headerEl.closeMobileMenuFromOutside());
  }

  @HostListener('cookieBannerAcceptAllSelected', ['$event'])
  onCookieBannerAcceptAllSelected(_event: CustomEvent) {
    this.cookiePreferenceService.agreeToAll();
  }

  @HostListener('cookieBannerSavePreferencesSelected', ['$event'])
  onCookieBannerSavePreferencesSelected(event: CustomEvent) {
    this.cookiePreferenceService.storePreferences({agreedToAll: false, agreedToCookieTypes: event.detail});
  }
}
