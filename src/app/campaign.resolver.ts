import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Campaign } from './campaign.model';
import { CampaignService } from './campaign.service';

@Injectable()
export class CampaignResolver implements Resolve<any> {
  constructor(
    public campaignService: CampaignService,
    private state: TransferState,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Campaign> {
    const campaignId = route.paramMap.get('campaignId');
    const campaignSlug = route.paramMap.get('campaignSlug');

    if (campaignId) {
      return this.loadWithStateCache(
        campaignId,
        (identifier: string) => this.campaignService.getOneById(identifier),
      );
    }

    return this.loadWithStateCache(
      campaignSlug || '',
      (identifier: string) => this.campaignService.getOneBySlug(identifier),
    );
  }

  private loadWithStateCache(
    identifier: string,
    method: (identifier: string) => Observable<Campaign>,
  ): Observable<Campaign> {
    const campaignKey = makeStateKey<Campaign>(`campaign-${identifier}`);
    const campaign = this.state.get(campaignKey, undefined);
    if (campaign) {
      return of(campaign);
    }

    const observable = method(identifier);
    observable.subscribe(loadedCampaign => {
      // Save in state for future routes, e.g. when moving between `CampaignDetailComponent`
      // and `DonationStartComponent`.
      this.state.set(campaignKey, loadedCampaign);
    });

    return observable;
  }
}
