import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Fund } from './fund.model';

@Injectable({
  providedIn: 'root',
})
export class FundService {
  private http = inject(HttpClient);

  private apiPath = '/funds/services/apexrest/v1.0/funds';

  getOneBySlug(fundSlug: string): Observable<Fund> {
    return this.http.get<Fund>(`${environment.sfApiUriPrefix}${this.apiPath}/slug/${fundSlug}`);
  }
}
