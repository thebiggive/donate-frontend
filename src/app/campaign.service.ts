import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CampaignSummary } from './campaign-summary.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private apiPath = '/campaigns/services/apexrest/v1.0/campaigns';

  constructor(
    private http: HttpClient,
  ) {}

  search(term): Observable<CampaignSummary[]> {
    return this.http.get<CampaignSummary[]>(`${environment.apiUriPrefix}${this.apiPath}?term=${term}`);
  }
}
