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

export const TBG_DONATE_ID_STORAGE = new InjectionToken<StorageService>('TBG_DONATE_ID_STORAGE');

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly loginPath = '/auth';
  private readonly peoplePath = '/people';
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

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(
      `${environment.identityApiPrefix}${this.peoplePath}`,
      person);
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
    return this.storage.get(this.storageKey) || undefined;
  }

  getJWT(): string | undefined {
    return this.getIdAndJWT()?.jwt;
  }

  isTokenForFinalisedUser(jwt: string): boolean {
    const data = jwtDecode<IdentityJWT>(jwt);

    return data.sub.complete;
  }

  saveJWT(id: string, jwt: string) {
    this.storage.set(this.storageKey, { id, jwt });
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
