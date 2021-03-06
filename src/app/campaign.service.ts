import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Campaign } from './campaign.model';
import { CampaignSummary } from './campaign-summary.model';
import { environment } from '../environments/environment';
import { SelectedType } from './search.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  static perPage = 6;

  private apiPath = '/campaigns/services/apexrest/v1.0';

  constructor(
    private http: HttpClient,
  ) {}

  static isPending(campaign: Campaign): boolean {
    return campaign.status === 'Pending';
  }

  static isOpenForDonations(campaign: Campaign): boolean {
    if (this.isPending(campaign)) {
      return false;
    }

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

  buildQuery(selected: SelectedType, offset: number, campaignId?: string, campaignSlug?: string, fundSlug?: string): {[key: string]: any} {
    const perPage = 6;
    const query: SearchQuery = {
      limit: perPage,
      offset,
      ...selected,
    };

    if (campaignId) {
      query.parentId = campaignId;
    }

    if (campaignSlug) {
      query.parentSlug = campaignSlug;
    }

    if (fundSlug) {
      query.fundSlug = fundSlug;
    }

    if (selected.sortField === '') { // this means sort by relevance for now
      query.sortDirection = undefined;
    } else { // match funds left and amount raised both make most sense in 'desc' order
      query.sortDirection = 'desc';
    }

    return query;
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

    if (searchQuery.parentId) {
      params = params.append('parent', searchQuery.parentId);
    }

    if (searchQuery.parentSlug) {
      params = params.append('parentSlug', searchQuery.parentSlug);
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
    if (!campaignSlug) {
      // TODO consider removing handling for this edge case once we call this
      // only on pages that have data binding completed as part of the router
      // pre-conditions. See DON-223.
      return new Observable();
    }

    return this.http.get<Campaign>(`${environment.apiUriPrefix}${this.apiPath}/campaigns/slug/${campaignSlug}`);
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
  public parentId?: string;
  public parentSlug?: string;
  public sortDirection?: string;
  public sortField?: string;
  public term?: string;
}
