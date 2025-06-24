import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';

export type AgreedToCookieTypes = {
  analyticsAndTesting: boolean;
  thirdParty: boolean;
};

export type CookiePreferences =
  | { agreedToAll: true }
  | {
      agreedToAll: false;
      agreedToCookieTypes: AgreedToCookieTypes;
    };

export const agreesToAnalyticsAndTracking = (prefs: CookiePreferences) =>
  prefs.agreedToAll || prefs.agreedToCookieTypes.analyticsAndTesting;
export const agreesToThirdParty = (prefs: CookiePreferences) =>
  prefs.agreedToAll || prefs.agreedToCookieTypes.thirdParty;

@Injectable({
  providedIn: 'root',
})
export class CookiePreferenceService {
  private cookieService = inject(CookieService);

  private cookiePreferences$: Subject<CookiePreferences | undefined>;

  private optInToAnalyticsAndTesting$: Subject<CookiePreferences>;

  private readonly cookieName = 'cookie-preferences';
  private readonly cookieExpiryPeriodDays = 365;

  constructor() {
    let cookiePreferences;
    try {
      cookiePreferences = JSON.parse(this.cookieService.get(this.cookieName)) as CookiePreferences;
    } catch (_e) {
      cookiePreferences = undefined;
    }

    this.cookiePreferences$ = new BehaviorSubject(cookiePreferences);
    if (
      cookiePreferences?.agreedToAll ||
      cookiePreferences?.agreedToCookieTypes.analyticsAndTesting ||
      cookiePreferences?.agreedToCookieTypes.thirdParty
    ) {
      this.optInToAnalyticsAndTesting$ = new BehaviorSubject(cookiePreferences);
    } else {
      this.optInToAnalyticsAndTesting$ = new Subject<CookiePreferences>();
    }
  }
  userHasExpressedCookiePreference(): Observable<boolean> {
    return this.cookiePreferences$.pipe(map((value) => !!value));
  }

  /**
   * Returns an observable that emits CookiePreferences and when the user has agreed to accept cookies - either
   * on subscription if they agreed in the past and we saved a cookie, or later if they agree during this session.
   */
  userOptInToSomeCookies(): Observable<CookiePreferences> {
    // There's no UI to allow a user to express a preference more than once without reloading the page, so we pipe the observable through take(1)
    // to make subscriptions automatically end free memory as soon as the opt-in is given.
    return this.optInToAnalyticsAndTesting$.pipe(take(1));
  }

  agreeToAll() {
    const preferences: CookiePreferences = { agreedToAll: true };
    this.cookieService.set(
      this.cookieName,
      JSON.stringify(preferences),
      this.cookieExpiryPeriodDays,
      '/',
      environment.sharedCookieDomain,
    );
    this.cookiePreferences$.next(preferences);
    this.optInToAnalyticsAndTesting$.next(preferences);
  }

  storePreferences(preferences: CookiePreferences) {
    this.cookieService.set(
      this.cookieName,
      JSON.stringify(preferences),
      this.cookieExpiryPeriodDays,
      '/',
      environment.sharedCookieDomain,
    );
    this.cookiePreferences$.next(preferences);

    if (
      preferences.agreedToAll ||
      preferences.agreedToCookieTypes.analyticsAndTesting ||
      preferences.agreedToCookieTypes.thirdParty
    ) {
      this.optInToAnalyticsAndTesting$.next(preferences);
    }
  }
}
