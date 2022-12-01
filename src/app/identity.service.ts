import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';

import { AnalyticsService } from './analytics.service';
import { Credentials } from './credentials.model';
import { environment } from '../environments/environment';
import { IdentityJWT } from './identity-jwt.model';
import { Person } from './person.model';
import { FundingInstruction } from './fundingInstruction.model';

export const TBG_DONATE_ID_STORAGE = new InjectionToken<StorageService>('TBG_DONATE_ID_STORAGE');

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly loginPath = '/auth';
  private readonly peoplePath = '/people';
  private readonly resetPasswordTokenPath = '/password-reset-token';
  // Key is per-domain/env. For now we simply store a single JWT (or none).
  private readonly storageKey = `${environment.identityApiPrefix}/v1/jwt`;

  constructor(
    private analyticsService: AnalyticsService,
    private http: HttpClient,
    @Inject(TBG_DONATE_ID_STORAGE) private storage: StorageService,
  ) {}

  login(credentials: Credentials): Observable<{ jwt: string}> {
    return this.http.post<{ jwt: string}>(
      `${environment.identityApiPrefix}${this.loginPath}`,
      credentials,
    );
  }

  getResetPasswordToken(email: string) {
    return this.http.post<{ jwt: string}>(
      `${environment.identityApiPrefix}${this.resetPasswordTokenPath}`,
      {email_address: email},
    );
  };

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(
      `${environment.identityApiPrefix}${this.peoplePath}`,
      person);
  }

  get(id: string, jwt: string): Observable<Person> {
    return this.http.get<Person>(
      `${environment.identityApiPrefix}${this.peoplePath}/${id}`,
      {
        headers: new HttpHeaders({ 'X-Tbg-Auth': jwt }),
      },
    );
  }

  update(person: Person): Observable<Person> {
    return this.http.put<Person>(
      `${environment.identityApiPrefix}${this.peoplePath}/${person.id}`,
      person,
      this.getAuthHttpOptions(person),
    );
  }
  
  clearJWT() {
    this.storage.remove(this.storageKey);
  }

  getIdAndJWT(): { id: string, jwt: string } | undefined {
    const idAndJwt = this.storage.get(this.storageKey);

    if (idAndJwt === undefined) {
      return undefined;
    }

    const data = this.getTokenPayload(idAndJwt?.jwt);
    if (data.exp as number < Math.floor(Date.now() / 1000)) {
      // JWT has expired.
      this.clearJWT();
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
    this.storage.set(this.storageKey, { id, jwt });
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
      this.analyticsService.logError(
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
}
