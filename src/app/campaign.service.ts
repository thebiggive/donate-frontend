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

  static percentRaised(campaign: (Campaign | CampaignSummary)): number | null {
    if (!campaign.target) {
      return null;
    }

    return 100 * campaign.amountRaised / campaign.target;
  }

  search(searchQuery: SearchQuery): Observable<CampaignSummary[]> {
    let params = new HttpParams();

    if (searchQuery.fundSlug) {
      params = params.append('fundSlug', searchQuery.fundSlug);
    }

    if (searchQuery.parentCampaignId) {
      params = params.append('parent', searchQuery.parentCampaignId);
    }

    if (searchQuery.parentCampaignSlug) {
      params = params.append('parentSlug', searchQuery.parentCampaignSlug);
    }

    if (searchQuery.term) {
      params = params.append('term', searchQuery.term);
    }

    return this.http.get<CampaignSummary[]>(`${environment.apiUriPrefix}${this.apiPath}`, { params });
  }

  getOneById(campaignId: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${environment.apiUriPrefix}${this.apiPath}/${campaignId}`);
  }

  getOneBySlug(campaignSlug: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${environment.apiUriPrefix}${this.apiPath}/slug/${campaignSlug}`);
  }
}

class SearchQuery {
  public fundSlug?: string;
  public parentCampaignId?: string;
  public parentCampaignSlug?: string;
  public term?: string;
}
