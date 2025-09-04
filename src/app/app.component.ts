import { APP_BASE_HREF, isPlatformBrowser, AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
  WritableSignal,
  inject,
} from '@angular/core';
import { Event as RouterEvent, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { BiggiveMainMenu, BiggiveFooter, BiggiveCookieBanner } from '@biggive/components-angular';
import { MatomoTracker } from 'ngx-matomo-client';
import { filter, map } from 'rxjs/operators';

import { DonationService } from './donation.service';
import { GetSiteControlService } from './getsitecontrol.service';
import { NavigationService } from './navigation.service';
import { IdentityService } from './identity.service';
import { environment } from '../environments/environment';
import { flags } from './featureFlags';
import {
  AgreedToCookieTypes,
  agreesToAnalyticsAndTracking,
  agreesToThirdParty,
  CookiePreferences,
  CookiePreferenceService,
} from './cookiePreference.service';
import { Observable, Subscription } from 'rxjs';
import { supportedBrowsers } from '../supportedBrowsers';
import { detect } from 'detect-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: 'app.component.scss',
  imports: [AsyncPipe, BiggiveCookieBanner, BiggiveFooter, BiggiveMainMenu, RouterOutlet],
})
export class AppComponent implements AfterViewInit, OnDestroy, OnInit {
  private baseHref = inject(APP_BASE_HREF);
  private identityService = inject(IdentityService);
  private donationService = inject(DonationService);
  private getSiteControlService = inject(GetSiteControlService);
  private navigationService = inject(NavigationService);
  private cookiePreferenceService = inject(CookiePreferenceService);
  private platformId = inject(PLATFORM_ID);
  private matomoTracker = inject(MatomoTracker);
  private router = inject(Router);

  @ViewChild(BiggiveMainMenu) header: BiggiveMainMenu | undefined;

  protected browserSupportedMessage?: string;
  public isLoggedIn: boolean = false;

  public readonly donateUriPrefix = environment.donateUriPrefix;
  public readonly blogUriPrefix = environment.blogUriPrefix;

  public readonly experienceUriPrefix = environment.experienceUriPrefix;

  public isDataLoaded = false;

  protected readonly environment = environment;
  protected readonly flags = flags;
  protected readonly userHasExpressedCookiePreference$: Observable<boolean>;
  protected readonly existingCookiePreferences: Observable<AgreedToCookieTypes | undefined>;

  convertCookiePreferencesForDisplay(cookiePrefs: CookiePreferences): AgreedToCookieTypes {
    switch (true) {
      case cookiePrefs === undefined:
        return { analyticsAndTesting: false, thirdParty: false };
      case cookiePrefs.agreedToAll:
        return { analyticsAndTesting: true, thirdParty: true };
      default:
        return cookiePrefs.agreedToCookieTypes;
    }
  }

  public currentUrlWithoutHash$: Observable<URL>;

  public isPlatformBrowser: boolean;
  public someCampaignHasHomePageRedirect: WritableSignal<boolean> = signal(false);
  private loginStatusChangeSubscription: Subscription | undefined;
  protected showingDedicatedCookiePreferencesPage: boolean | undefined;

  constructor() {
    const navigationService = this.navigationService;
    const router = this.router;

    this.isPlatformBrowser = isPlatformBrowser(this.platformId);
    this.userHasExpressedCookiePreference$ = this.cookiePreferenceService.userHasExpressedCookiePreference();
    this.existingCookiePreferences = this.cookiePreferenceService
      .userOptInToSomeCookies()
      .pipe(map(this.convertCookiePreferencesForDisplay));

    navigationService.setPossibleRedirectSignal(this.someCampaignHasHomePageRedirect);

    // https://www.amadousall.com/angular-routing-how-to-display-a-loading-indicator-when-navigating-between-routes/
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          this.navigationService.saveNewUrl(event.urlAfterRedirects);

          this.showingDedicatedCookiePreferencesPage = event.url === '/cookie-preferences';
        }
      }
    });

    this.currentUrlWithoutHash$ = router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      map((_event) => {
        const url = new URL(environment.donateUriPrefix + router.url);
        url.hash = '';
        return url;
      }),
    );
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

  ngOnInit() {
    if (this.isPlatformBrowser) {
      // detect supported browser or inform user, https://dev.to/aakashgoplani/manage-list-of-supported-browsers-for-your-application-in-angular-4b47
      const browserIsSupported = supportedBrowsers.test(navigator.userAgent);
      if (!browserIsSupported) {
        const browser = detect();
        const browserName = browser && browser.name ? browser.name : undefined;
        const browserVersion = browser && browser.version ? browser.version : undefined;
        this.browserSupportedMessage = `Your current browser: ${capitalize(browserName)} ${browserVersion} is older than Big Give can fully support, so some things may not work perfectly. If you have trouble, please try another browser.`;
      }

      this.cookiePreferenceService.userOptInToSomeCookies().subscribe((preferences: CookiePreferences) => {
        if (agreesToThirdParty(preferences)) {
          this.getSiteControlService.init();
        }

        if (agreesToAnalyticsAndTracking(preferences)) {
          this.matomoTracker.setCookieConsentGiven();
        }
      });
    }

    // This service needs to be injected app-wide and this line is here, because
    // we need to be sure the server-detected `COUNTY_CODE` InjectionToken is
    // always set up during the initial page load, regardless of whether the first
    // page the donor lands on makes wider use of DonationService or not.
    this.donationService.deriveDefaultCountry();

    this.loginStatusChangeSubscription = this.identityService.loginStatusChanged.subscribe({
      next: (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
        // This double-checks the JWT and sets `isLoggedIn` again, but if event emitters' use is correct then
        // that's a no-op.
        this.updatePersonInfo();
      },
    });

    this.updatePersonInfo();

    function capitalize(str: string | undefined): string {
      if (str === undefined) {
        return '(Unknown)';
      }

      if (str.toLowerCase() === 'ios') {
        return 'iOS';
      }

      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }

  ngOnDestroy() {
    if (this.loginStatusChangeSubscription) {
      this.loginStatusChangeSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    /**
     * Server copy never has the menu open and doesn't have a DOM for Stencil to adjust.
     */
    if (isPlatformBrowser(this.platformId)) {
      this.setUpMenuCloseOnNavigation();
    }
  }

  @HostListener('cookieBannerAcceptAllSelected', ['$event'])
  onCookieBannerAcceptAllSelected(_event: CustomEvent) {
    this.cookiePreferenceService.agreeToAll();
  }

  @HostListener('logoutClicked', ['$event'])
  onLogoutClicked(_event: CustomEvent) {
    this.identityService.logout();
    void this.router.navigate(['']);
  }

  @HostListener('preferenceModalClosed', ['$event'])
  async onCookieBannerPreferenceModalClosed(_event: CustomEvent) {
    if (this.showingDedicatedCookiePreferencesPage) {
      await this.router.navigateByUrl('/');
    }
  }

  @HostListener('cookieBannerSavePreferencesSelected', ['$event'])
  onCookieBannerSavePreferencesSelected(event: CustomEvent) {
    this.cookiePreferenceService.storePreferences({ agreedToAll: false, agreedToCookieTypes: event.detail });
  }

  private updatePersonInfo() {
    this.isLoggedIn = this.identityService.probablyHaveLoggedInPerson();
    this.isDataLoaded = true;
  }

  private setUpMenuCloseOnNavigation() {
    const headerEl = this.header;
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationStart)).subscribe(
      // we have seen TypeError: Cannot read properties of undefined (reading 'closeMobileMenuFromOutside'). So check headerEl is defined beofore reading the prop:
      () => headerEl && headerEl.closeMobileMenuFromOutside(),
    );
  }
}
