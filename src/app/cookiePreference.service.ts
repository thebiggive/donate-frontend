import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../environments/environment";
import {map} from "rxjs/operators";

type CookiePreferences =
    {agreedToAll: true} |
    {
      agreedToAll: false,
      agreedToCookieTypes: {
        marketing: boolean,
      }};

@Injectable({
  providedIn: 'root',
})
export class CookiePreferenceService {

  private cookiePreferences$: Subject<CookiePreferences | undefined>;

  private readonly cookieName = "cookie-preferences";
  private readonly cookieExpiryPeriodDays = 365;

  constructor(
      private cookieService: CookieService,
  ) {
    let cookiePreferences;
    try {
      cookiePreferences = JSON.parse(this.cookieService.get(this.cookieName)) as CookiePreferences;
    } catch (e) {
      cookiePreferences = undefined;
    }

    this.cookiePreferences$ = new BehaviorSubject(cookiePreferences)
  }
  userHasExpressedCookiePreference(): Observable<boolean>
  {
    return this.cookiePreferences$.pipe(map(value => !! value));
  }

  agreeToAll() {
    const preferences: CookiePreferences = {agreedToAll: true};
    this.cookieService.set(this.cookieName, JSON.stringify(preferences), this.cookieExpiryPeriodDays, '/', environment.sharedCookieDomain)
    this.cookiePreferences$.next(preferences);
  }

  storePreferences(preferences: CookiePreferences) {
    this.cookieService.set(this.cookieName, JSON.stringify(preferences), this.cookieExpiryPeriodDays, '/', environment.sharedCookieDomain)
    this.cookiePreferences$.next(preferences);
  }
}
