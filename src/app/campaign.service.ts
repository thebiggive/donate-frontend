import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';

import { Campaign } from './campaign.model';
import { CampaignSummary } from './campaign-summary.model';
import { environment } from '../environments/environment';

export const TBG_FILTERS_STORAGE = new InjectionToken<StorageService>('TBG_FILTERS_STORAGE');

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private apiPath = '/campaigns/services/apexrest/v1.0';
  private readonly storageKey = `${environment.donateUriPrefix}/campaignFilters/v2`; // Key is per-domain/env

  constructor(
    private http: HttpClient,
    @Inject(TBG_FILTERS_STORAGE) private storage: StorageService,
  ) {}

  static isOpenForDonations(campaign: Campaign): boolean {
    if (campaign.status === 'Active') {
      return true;
    }

    if (new Date(campaign.startDate) > new Date()) {
      return false;
    }

    return (new Date(campaign.endDate) >= new Date());
  }

  static isInFuture(campaign: Campaign): boolean {
    if (campaign.status === 'Active' || campaign.status === 'Expired') {
      return false;
    }

    return (new Date(campaign.startDate) > new Date());
  }

  static percentRaised(campaign: (Campaign | CampaignSummary)): number | undefined {
    if (!campaign.target) {
      return undefined;
    }

    return 100 * campaign.amountRaised / campaign.target;
  }

  getForCharity(charityId: string): Observable<CampaignSummary[]> {
    return this.http.get<CampaignSummary[]>(`${environment.apiUriPrefix}${this.apiPath}/charities/${charityId}/campaigns`);
  }

  search(searchQuery: SearchQuery): Observable<CampaignSummary[]> {
    let params = new HttpParams();

    if (searchQuery.limit) {
      params = params.append('limit', searchQuery.limit.toString());
    }

    if (searchQuery.offset) {
      params = params.append('offset', searchQuery.offset.toString());
    }

    if (searchQuery.beneficiary) {
      params = params.append('beneficiary', searchQuery.beneficiary);
    }

    if (searchQuery.category) {
      params = params.append('category', searchQuery.category);
    }

    if (searchQuery.country) {
      params = params.append('country', searchQuery.country);
    }

    if (searchQuery.fundSlug) {
      params = params.append('fundSlug', searchQuery.fundSlug);
    }

    if (searchQuery.onlyMatching) {
      params = params.append('onlyMatching', 'true');
    }

    if (searchQuery.parentCampaignId) {
      params = params.append('parent', searchQuery.parentCampaignId);
    }

    if (searchQuery.parentCampaignSlug) {
      params = params.append('parentSlug', searchQuery.parentCampaignSlug);
    }

    if (searchQuery.sortDirection) {
      params = params.append('sortDirection', searchQuery.sortDirection);
    }

    if (searchQuery.sortField) {
      params = params.append('sortField', searchQuery.sortField);
    }

    if (searchQuery.term) {
      params = params.append('term', searchQuery.term);
    }

    return this.http.get<CampaignSummary[]>(`${environment.apiUriPrefix}${this.apiPath}/campaigns`, { params });
  }

  getOneById(campaignId: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${environment.apiUriPrefix}${this.apiPath}/campaigns/${campaignId}`);
  }

  getOneBySlug(campaignSlug: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${environment.apiUriPrefix}${this.apiPath}/campaigns/slug/${campaignSlug}`);
  }

  saveFilters(searchQuery?: SearchQuery) {
    this.storage.set(this.storageKey, searchQuery);
  }

  getFilters(): SearchQuery {
    return this.storage.get(this.storageKey);
  }

  removeFilters() {
    this.storage.remove(this.storageKey);
  }
}

interface SearchQueryInterface {
  [key: string]: any;
}

export class SearchQuery implements SearchQueryInterface {
  public beneficiary?: string;
  public category?: string;
  public country?: string;
  public fundSlug?: string;
  public limit = 6;
  public offset = 0;
  public onlyMatching?: boolean;
  public parentCampaignId?: string;
  public parentCampaignSlug?: string;
  public sortDirection?: string;
  public sortField?: string;
  public term?: string;
}
