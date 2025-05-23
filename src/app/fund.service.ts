import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Fund } from './fund.model';

@Injectable({
  providedIn: 'root',
})
export class FundService {
  private apiPath = '/funds/services/apexrest/v1.0/funds';

  constructor(private http: HttpClient) {}

  getOneBySlug(fundSlug: string): Observable<Fund> {
    return this.http.get<Fund>(`${environment.sfApiUriPrefix}${this.apiPath}/slug/${fundSlug}`);
  }
}
