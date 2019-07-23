import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Campaign } from './campaign.model';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private apiPath = '/campaigns/services/apexrest/v1.0/campaigns/';

  campaign: Observable<Campaign[]>;

  constructor(
    private http: HttpClient,
  ) {}
  /* tslint:disable:max-line-length*/
  getCampaign(campaignId): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${environment.apiUriPrefix}${this.apiPath}` + campaignId);
  }
  /* tslint:enable:max-line-length*/
}
