import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EventEmitter, Inject, Injectable, InjectionToken} from '@angular/core';
import jwtDecode from 'jwt-decode';
import {CookieService} from 'ngx-cookie-service';
import {MatomoTracker} from 'ngx-matomo-client';
import {firstValueFrom, Observable, of} from 'rxjs';
import {delay, map, retry, tap} from 'rxjs/operators';

import {Credentials} from './credentials.model';
import {environment} from '../environments/environment';
import {IdentityJWT} from './identity-jwt.model';
import {Person} from './person.model';
import {FundingInstruction} from './fundingInstruction.model';
import {STRIPE_SESSION_SECRET_COOKIE_NAME} from "./donation.service";
import {EmailVerificationToken} from './email-verification-token.resolver';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  /** Cookie to share with WP which needs to know whether we're logged in as a donor to be able to show the
   * correct menu variant but does not need access to the actual session cookie that holds the JWT.
   */
  private readonly isLoggedInCookieName = 'IS_LOGGED_IN';
  private readonly cookieName = 'SESSION';
  private readonly loginPath = '/auth';
  private readonly peoplePath = '/people';
  private readonly resetPasswordTokenPath = '/password-reset-token';
  private readonly resetPasswordPath = '/change-forgotten-password';
  // Key is per-domain/env. For now we simply store a single JWT (or none).
  private readonly storageKey = `${environment.identityApiPrefix}/v1/jwt`;

  // Tracks and changes login status; shared between e.g. outer app menu and specific pages.
  loginStatusChanged = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private matomoTracker: MatomoTracker,
    private cookieService: CookieService,
  ) {}

  login(credentials: Credentials): Observable<{ id: string, jwt: string}> {
    return this.http.post<{ id: string, jwt: string }>(
      `${environment.identityApiPrefix}${this.loginPath}`,
      // @todo:1072: Remove captcha_type when identity defaults to friendy_captcha
      {...credentials, captcha_type: 'friendly_captcha'},
    ).pipe(tap({
      next: (response)  => {
        this.saveJWT(response.id, response.jwt);
        this.loginStatusChanged.emit(true);
      }
    }));
  }

  getResetPasswordToken(email: string, captchaCode: string): Observable<[]> {
    return this.http.post<[]>(
      `${environment.identityApiPrefix}${this.resetPasswordTokenPath}`,
      {email_address: email},
      {
        headers: {
          "x-captcha-code": captchaCode
        }
      }
    );
  }

  checkTokenValid(token: string): Observable<object> {
    return this.http.get(
      `${environment.identityApiPrefix}${this.resetPasswordTokenPath}/${token}`,
    );
  }

  resetPassword(password: string, token: string) {
    return this.http.post<{ jwt: string}>(
      `${environment.identityApiPrefix}${this.resetPasswordPath}`,
      {
        new_password: password,
        secret: token
      },
    );
  }

  /**
   * secret number (from email verification) will be required soon if setting a password.
   */
  create(person: Person & ({secretNumber: string | undefined} | {raw_password: undefined})): Observable<Person> {
    return this.http.post<Person>(
      `${environment.identityApiPrefix}${this.peoplePath}`,
      person).pipe(
        tap((_person) => {
          // I would like to run:
          //      this.saveJWT(person.id as string, person.completion_jwt as string);
          // here and then make saveJWT private - and it seems to work with manual tests
          // but it's generating errors "InvalidTokenError: Invalid token specified" in unit tests. Not sure why.
          this.loginStatusChanged.emit(true);
        })
    )
  }

  get(id: string, jwt: string, {withTipBalances = false, refresh = false}: {withTipBalances?: boolean, refresh?: boolean} = {}): Observable<Person> {
    let cacheBuster: string;
    if (refresh) {
      cacheBuster = "?cacheBust=" + (new Date()).getTime();
    } else {
      cacheBuster = '';
    }

    return this.http.get<Person>(
      `${environment.identityApiPrefix}${this.peoplePath}/${id}${cacheBuster}`,
      {
        headers: new HttpHeaders({ 'X-Tbg-Auth': jwt }),
        params: {
          withTipBalances: withTipBalances ? 'true' : 'false',
        },
      },
    );
  }

  /**
   * Quick & dirty helper to infer logged in status from token without adding wasteful API calls.
   */
  probablyHaveLoggedInPerson(): boolean {
    return this.getIdAndJWT() !== undefined && this.isTokenForFinalisedUser(this.getJWT() as string);
  }

  /**
   * Returns an observable of a person if logged in, or of null.
   * Note that the person may not have a password - if not they should
   * probably not be treated as fully logged-in, although we could offer
   * them the opportunity to set a password. This call doesn't get their pending
   * bank-funded tips balance, which is only used on the Transfer Funds page.
   */
  getLoggedInPerson(): Observable<null|Person> {
    const idAndJWT = this.getIdAndJWT();

    if (!idAndJWT || !this.isTokenForFinalisedUser(idAndJWT.jwt)) {
      return of(null);
    }

    return this.get(idAndJWT.id, idAndJWT.jwt);
  }

  getPerson({ refresh = false }: {refresh?: boolean}): Observable<null|Person> {
    const idAndJWT = this.getIdAndJWT();

    if (!idAndJWT) {
      return of(null);
    }

    return this.get(idAndJWT.id, idAndJWT.jwt, {refresh: refresh});
  }

  update(person: Person): Observable<Person> {
    return this.http.put<Person>(
      `${environment.identityApiPrefix}${this.peoplePath}/${person.id}`,
      person,
      this.getAuthHttpOptions(person),
    ).pipe(retry(2), delay(2_000));
  }

  logout() {
    this.cookieService.delete(this.cookieName);
    this.cookieService.delete(this.isLoggedInCookieName);
    this.cookieService.delete(STRIPE_SESSION_SECRET_COOKIE_NAME);

    // delete didn't seem to work reliably, so also directly setting an empty cookie that expires in the past here:
    this.cookieService.set(this.cookieName, '', new Date('1970-01-01'), '/')
    this.cookieService.set(this.isLoggedInCookieName, '', new Date('1970-01-01'), '/');
    this.cookieService.set(STRIPE_SESSION_SECRET_COOKIE_NAME, '', new Date('1970-01-01'), '/')
    this.loginStatusChanged.emit(false);
  }

  getIdAndJWT(): { id: string, jwt: string } | undefined {
    const cookieValue = this.cookieService.get(this.cookieName);
    if (!cookieValue) {
      return undefined;
    }

    const idAndJwt: {jwt: string, id: string} = JSON.parse(cookieValue);

    if (idAndJwt === undefined) {
      return undefined;
    }

    if ((this.getTokenPayload(idAndJwt.jwt).exp as number) < Math.floor(Date.now() / 1000)) {
      // JWT has expired.
      this.logout();
      return undefined;
    }

    return idAndJwt;
  }

  getJWT(): string | undefined {
    return this.getIdAndJWT()?.jwt;
  }

  getPspId(): string {
    const data = this.getTokenPayload(this.getJWT() as string);

    return data.sub.psp_id;
  }

  isTokenForFinalisedUser(jwt: string): boolean {
    return this.getTokenPayload(jwt).sub.complete;
  }

  saveJWT(id: string, jwt: string) {
    const daysTilExpiry = 1;
    this.cookieService.set(this.cookieName, JSON.stringify({id, jwt}), daysTilExpiry, '/');
    if (this.probablyHaveLoggedInPerson()) {
      this.cookieService.set(this.isLoggedInCookieName, 'true', daysTilExpiry, '/', this.domainSharedWithWordpress());
    }
  }

  private domainSharedWithWordpress() {
    const hostname = new URL(environment.donateUriPrefix).hostname;
    const parts = hostname.split('.');
    parts.shift();

    // length will be zero when domain is localhost. In other cases we have a shared domain above that
    // with our WordPress site.
    return parts.length === 0 ? hostname : parts.join('.');
  }

  getFundingInstructions(id: string, jwt: string): Observable<FundingInstruction> {
    return this.http.get<FundingInstruction>(
      `${environment.identityApiPrefix}${this.peoplePath}/${id}/funding_instructions?currency=gbp`,
      {
        headers: new HttpHeaders({ 'X-Tbg-Auth': jwt }),
      },
    );
  }

  private getTokenPayload(jwt: string): IdentityJWT {
    return jwtDecode<IdentityJWT>(jwt);
  }

  private getAuthHttpOptions(person: Person): { headers: HttpHeaders } {
    const jwt = this.getJWT();

    if (jwt === undefined) {
      this.matomoTracker.trackEvent(
        'identity_error',
        'auth_jwt_error',
        `Not authorised to work with person ${person.id}`,
      );

      return { headers: new HttpHeaders({}) };
    }

    return {
      headers: new HttpHeaders({
        'X-Tbg-Auth': jwt,
      }),
    };
  }

  async getEmailVerificationTokenDetails({secretNumber, personUUID}: {
    secretNumber: string | undefined;
    personUUID: string | undefined
  }): Promise<EmailVerificationToken> {
    const uri = `${environment.identityApiPrefix}/emailVerificationToken/${secretNumber}/${personUUID}`;

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return firstValueFrom(this.http.get(uri).pipe(map(((response: any) => response.token))));
  }

  async requestEmailAuthToken(emailAddress: string, {captcha_code}: {captcha_code: string} ): Promise<Object> {
    const uri = `${environment.identityApiPrefix}/emailVerificationToken/`;

    return firstValueFrom(this.http.post(
      uri,
      {
        emailAddress,
      },
      {
       headers: {
         "x-captcha-code": captcha_code
       }
      }
      ));
  }

  /**
   * After a non-logged in donor donates they have an account but there is no password set on it. This method
   * allows setting a password using the secret number that we emailed to them in their donation confirmation
   * message.
   */
  async setFirstPasswordWithToken(password: string, {person_uuid, secretNumber}: EmailVerificationToken): Promise<Object> {
    // @todo add an Identity route with UUID included & then switch Donate's used route over
    const uri = `${environment.identityApiPrefix}/people/setFirstPassword`;

    return firstValueFrom(this.http.post(
      uri,
      {
        personUuid: person_uuid,
        secret: secretNumber,
        password: password,
      }));
  }

  async checkNewAccountEmailVerificationTokenValid({emailAddress, secret}: {
    secret: string;
    emailAddress: string | undefined
  }): Promise<boolean> {
    try {
      const {token} = await firstValueFrom(this.http.post(
        `${environment.identityApiPrefix}/emailVerificationToken/check-is-valid-no-person-id`,
        {
          emailAddress,
          secret,
        },
      ) as Observable<{token: EmailVerificationToken}>);

      return token.valid;
    } catch (error) {
      return false;
    }
  }
}

export function getPersonAuthHttpOptions(jwt?: string): { headers: HttpHeaders } {
  if (!jwt) {
    return { headers: new HttpHeaders({}) };
  }

  return {
    headers: new HttpHeaders({
      'X-Tbg-Auth': jwt,
    }),
  };
}
