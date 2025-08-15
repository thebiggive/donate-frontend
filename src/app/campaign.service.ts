import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Campaign } from './campaign.model';
import { CampaignStats, formatCampaignStats } from './campaign-stats.model';
import { CampaignSummary, CampaignSummaryList } from './campaign-summary.model';
import { environment } from '../environments/environment';
import { SelectedType } from './search.service';
import { HighlightCard, SfApiHighlightCard, SFHighlightCardsToFEHighlightCards } from './highlight-cards/HighlightCard';
import { map } from 'rxjs/operators';
import { flags } from './featureFlags';
import { MetaCampaign } from './metaCampaign.model';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private http = inject(HttpClient);

  static perPage = 6;

  private apiPath = '/campaigns/services/apexrest/v1.0' as const;

  /**
   * See also the less forgiving variant `campaignIsOpenLessForgiving`.
   */
  static isOpenForDonations(campaign: Campaign | MetaCampaign): boolean {
    if (campaign.hidden || !campaign.ready) {
      return false;
    }

    if (campaign.status === 'Active') {
      return true;
    }

    const now = new Date();

    if (new Date(campaign.startDate) > now) {
      return false;
    }

    return new Date(campaign.endDate) >= now;
  }

  /**
   * Unlike the isOpenForDonations method which is more forgiving if the status gets stuck Active (we don't trust
   * these to be right in Salesforce yet), this check relies solely on campaign dates.
   *
   * Two variants of logic have existed since commit 6636eeeb . Consider consolidating, maybe after backend move to
   * matchbot.
   */
  static campaignIsOpenLessForgiving(campaign: Campaign) {
    return campaign ? new Date(campaign.startDate) <= new Date() && new Date(campaign.endDate) > new Date() : false;
  }

  static isInFuture(campaign: Campaign | MetaCampaign | CampaignSummary): boolean {
    if (campaign.status === 'Active' || campaign.status === 'Expired') {
      return false;
    }

    return new Date(campaign.startDate) > new Date();
  }

  static isInPast(campaign: Campaign | MetaCampaign | CampaignSummary): boolean {
    return campaign.status === 'Expired' || new Date(campaign.endDate) < new Date();
  }

  static getRelevantDate(campaign: Campaign | MetaCampaign | CampaignSummary): Date | undefined {
    let dateToUse: Date | undefined;

    if (this.isInFuture(campaign)) {
      dateToUse = new Date(campaign.startDate);
    } else if (this.isInPast(campaign)) {
      dateToUse = new Date(campaign.endDate);
    }

    return dateToUse;
  }

  static campaignDurationInDays(campaign: MetaCampaign): number {
    return Math.floor((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / 86400000);
  }

  static percentRaisedOfIndividualCampaign(campaign: Campaign | CampaignSummary) {
    if (!campaign.target) {
      return undefined;
    }

    // `percentRaised` can return more than 100% in the case where campaigns have exceeded
    // their targets. <biggive-progress-bar> component ensures the bar doesn't overflow.
    // See DON-650.
    return Math.round((campaign.amountRaised / campaign.target) * 100);
  }

  /**
   * Gets % of the parent target if `parentUsesSharedFunds`, or the individual target otherwise.
   */
  static percentRaisedOfCampaignOrParent(campaign: Campaign): number | undefined {
    if (campaign.parentUsesSharedFunds && campaign.parentTarget && campaign.parentAmountRaised) {
      return Math.round((campaign.parentAmountRaised / campaign.parentTarget) * 100);
    }

    return CampaignService.percentRaisedOfIndividualCampaign(campaign);
  }

  buildQuery(
    selected: SelectedType,
    offset: number,
    campaignSlug?: string,
    fundSlug?: string,
    // any predates having this linting rule on.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): { [key: string]: any } {
    const perPage = 6;
    const query: SearchQuery = {
      limit: perPage,
      offset,
      ...selected,
    };

    if (campaignSlug) {
      query.parentSlug = campaignSlug;
    }

    if (fundSlug) {
      query.fundSlug = fundSlug;
    }

    if (flags.useMatchbotCampaignSearchApi) {
      this.sortForMatchbot(query, selected);
    } else {
      this.sortForSalesforce(query, selected);
    }

    return query;
  }

  getForCharity(charityId: string): Observable<
    | CampaignSummary[]
    | {
        charityName: string;
        campaigns: CampaignSummary[];
      }
  > {
    if (flags.useMatchbotCharityApi) {
      // use matchbot here when its ready
      return this.http.get<{
        charityName: string;
        campaigns: CampaignSummary[];
      }>(`${environment.matchbotApiPrefix}/charities/${charityId}/campaigns`);
    } else {
      return this.http.get<CampaignSummary[]>(
        `${environment.sfApiUriPrefix}${this.apiPath}/charities/${charityId}/campaigns`,
      );
    }
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

    switch (flags.useMatchbotCampaignSearchApi) {
      case false:
        return this.http.get<CampaignSummary[]>(`${environment.sfApiUriPrefix}${this.apiPath}/campaigns`, { params });
      case true:
        return this.http
          .get<CampaignSummaryList>(`${environment.matchbotApiPrefix}/campaigns`, { params })
          .pipe(map((response) => response.campaignSummaries));
    }
  }

  /**
   * Gets details of a campaign from a backend system - currently SF in prod but changing over to matchbot
   */
  getCharityCampaignById(campaignId: string): Observable<Campaign> {
    switch (flags.useMatchbotCampaignApi) {
      case false:
        return this.http.get<Campaign>(`${environment.sfApiUriPrefix}${this.apiPath}/campaigns/${campaignId}`);
      case true:
        return this.http.get<Campaign>(`${environment.matchbotApiPrefix}/campaigns/${campaignId}`);
    }
  }

  getCharityCampaignPreviewById(campaignId: string) {
    switch (flags.useMatchbotCampaignApi) {
      case false:
        return this.http.get<Campaign>(`${environment.sfApiUriPrefix}${this.apiPath}/campaigns/${campaignId}`);
      case true:
        return this.http
          .get<{ campaign: Campaign }>(`${environment.matchbotApiPrefix}/campaigns/early-preview/${campaignId}`)
          .pipe(map((response) => response.campaign));
    }
  }

  getMetaCampaignBySlug(campaignSlug: string): Observable<MetaCampaign> {
    if (!campaignSlug) {
      // TODO consider removing handling for this edge case once we call this
      // only on pages that have data binding completed as part of the router
      // pre-conditions. See DON-223.
      return new Observable();
    }

    switch (flags.useMatchbotMetaCampaignApi) {
      case false:
        return this.http.get<MetaCampaign>(
          `${environment.sfApiUriPrefix}${this.apiPath}/campaigns/slug/${campaignSlug}`,
        );
      case true:
        return this.http
          .get<{ metaCampaign: MetaCampaign }>(`${environment.matchbotApiPrefix}/meta-campaigns/${campaignSlug}`)
          .pipe(map(({ metaCampaign }) => metaCampaign));
    }
  }

  getCampaignImpactStats() {
    return this.http
      .get<CampaignStats>(`${environment.sfApiUriPrefix}${this.apiPath}/campaigns/stats`)
      .pipe(map(formatCampaignStats));
  }

  getHomePageHighlightCards(): Observable<HighlightCard[]> {
    return this.http
      .get<SfApiHighlightCard[]>(`${environment.sfApiUriPrefix}${this.apiPath}/highlight-service`)
      .pipe(map(SFHighlightCardsToFEHighlightCards));
  }

  private sortForMatchbot(query: SearchQuery, selected: SelectedType) {
    switch (selected.sortField) {
      case 'relevance':
        query.sortField = 'relevance';
        query.sortDirection = 'desc';
        break;
      case 'amountRaised':
        query.sortField = 'amountRaised';
        query.sortDirection = 'desc';
        break;
      case 'leastRaised':
        query.sortField = 'amountRaised';
        query.sortDirection = 'asc';
        break;
      case 'closeToTarget':
        query.sortField = 'distanceToTarget';
        query.sortDirection = 'asc';
        break;
      case 'matchFundsRemaining':
      default: // Live campaign UI should choose this default on its own, but also make it the global fallback.
        query.sortField = 'distanceToTarget';
        query.sortDirection = 'desc';
        break;
    }
  }

  private sortForSalesforce(query: SearchQuery, selected: SelectedType) {
    if (selected.sortField?.toLowerCase() === 'relevance') {
      query.sortField = undefined; // Campaign API takes blank/default sort to be relevance.
      query.sortDirection = undefined;
    } else if (selected.sortField === 'leastRaised') {
      query.sortDirection = 'asc';
      query.sortField = 'amountRaised';
    } else if (selected.sortField === 'closeToTarget') {
      query.sortDirection = 'asc';
      query.sortField = 'matchFundsRemaining';
    } else {
      // match funds left and amount raised both make most sense in 'desc' order
      query.sortDirection = 'desc';
    }
  }
}

interface SearchQueryInterface {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
}

export class SearchQuery implements SearchQueryInterface {
  public beneficiary?: string;
  public category?: string;
  public country?: string;
  public fundSlug?: string;
  public limit = 6;
  public offset?: number | undefined = 0;
  public parentId?: string;
  public parentSlug?: string;
  public sortDirection?: string;
  public sortField?: string;
  public term?: string;
}
