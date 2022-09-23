import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';

import { AnalyticsService } from './analytics.service';
import { environment } from '../environments/environment';
import { Person } from './person.model';

export const TBG_DONATE_ID_STORAGE = new InjectionToken<StorageService>('TBG_DONATE_ID_STORAGE');

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly apiPath = '/people';
  // Key is per-domain/env. For now we simply store a single JWT (or none).
  private readonly storageKey = `${environment.identityApiPrefix}/v1/jwt`;

  constructor(
    private analyticsService: AnalyticsService,
    private http: HttpClient,
    @Inject(TBG_DONATE_ID_STORAGE) private storage: StorageService,
  ) {}

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(
      `${environment.identityApiPrefix}${this.apiPath}`,
      person);
  }

  update(person: Person): Observable<Person> {
    return this.http.put<Person>(
      `${environment.identityApiPrefix}${this.apiPath}/${person.id}`,
      person,
      this.getAuthHttpOptions(person),
    );
  }

  getIdAndJWT(): { id: string, jwt: string } | undefined {
    return this.storage.get(this.storageKey) || undefined;
  }

  getJWT(): string | undefined {
    return this.getIdAndJWT()?.jwt;
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
