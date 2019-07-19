import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Campaign } from './campaign.model';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiPath = '/campaigns/services/apexrest/v1.0/campaigns/';

  campaign: Observable<Campaign[]>

  constructor(
    private http: HttpClient,
  ) {}

  getCampaign(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${environment.apiUriPrefix}${this.apiPath}` + 'a051r00001EywjpAAB');
  }
}
