import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Campaign } from './campaign.model';
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

  search(parentCampaignId?: string, term?: string): Observable<CampaignSummary[]> {
    let params = new HttpParams();
    if (parentCampaignId) {
      params = params.append('parent', parentCampaignId);
    }

    if (term) {
      params = params.append('term', term);
    }

    return this.http.get<CampaignSummary[]>(`${environment.apiUriPrefix}${this.apiPath}`, { params });
  }

  getOne(campaignId): Observable<Campaign> {
    return this.http.get<Campaign>(`${environment.apiUriPrefix}${this.apiPath}/${campaignId}`);
  }
}
