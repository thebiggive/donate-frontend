import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
  ) {}

  search(term: string = null, parentCampaignId: string = null): Observable<CampaignSummary[]> {
    if (!term && !parentCampaignId) {
      throw new Error('A search term or parent campaign is required');
    }

    console.log('Term', term);
    console.log('ID', parentCampaignId);

    const params: HttpParams = new HttpParams();

    if (parentCampaignId) {
      console.log('SETTING PARENT');
      params.set('parent', parentCampaignId);
    }

    if (term) {
      params.set('term', term);
    }

    console.log('HERE!');
    console.log(JSON.stringify(params.get('parent')));
    console.log(params.toString());

    return this.http.get<CampaignSummary[]>(`${environment.apiUriPrefix}${this.apiPath}?${params.toString()}`);
  }

  getOne(campaignId): Observable<Campaign> {
    return this.http.get<Campaign>(`${environment.apiUriPrefix}${this.apiPath}/${campaignId}`);
  }
}
