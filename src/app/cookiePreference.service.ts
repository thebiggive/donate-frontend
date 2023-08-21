import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {CookieService} from "ngx-cookie-service";

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

  private userHasAgreedToAllCookies: Subject<boolean>;
  private readonly cookieName = "cookie-preferences";
  private readonly cookieExpiryPeriodDays = 365;

  constructor(
      private cookieService: CookieService,
  ) {
    let cookiePreferences;
    try {
      cookiePreferences = JSON.parse(this.cookieService.get(this.cookieName)) as CookiePreferences;
    } catch (e) {
      cookiePreferences = null;
    }

    this.userHasAgreedToAllCookies = new BehaviorSubject(!! (cookiePreferences && cookiePreferences.agreedToAll))
  }
  userHasExpressedCookiePreference(): Observable<boolean>
  {
    return this.userHasAgreedToAllCookies;
  }

  agreeToAll() {
    const preferences: CookiePreferences = {agreedToAll: true};
    this.cookieService.set(this.cookieName, JSON.stringify(preferences), this.cookieExpiryPeriodDays)
    this.userHasAgreedToAllCookies.next(true);
  }
}
