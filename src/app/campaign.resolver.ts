import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Campaign } from './campaign.model';
import { CampaignService } from './campaign.service';

@Injectable()
export class CampaignResolver implements Resolve<any> {
  constructor(
    public campaignService: CampaignService,
    private router: Router,
    private state: TransferState,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Campaign> {
    const campaignId = route.paramMap.get('campaignId');
    const campaignSlug = route.paramMap.get('campaignSlug');

    // No . expected in slugs, and these are typically part of opportunistic junk requests.
    if (campaignSlug && campaignSlug.match(new RegExp('[.]+'))) {
      console.log(`CampaignResolver skipping load attempt for junk slug: "${campaignSlug}"`);
      // Because it happens server side & before resolution, `replaceUrl` seems not to
      // work, so just fall back to serving the Home content on the requested path.
      this.router.navigateByUrl('/');
      return EMPTY;
    }

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

    const observable = method(identifier)
      .pipe(catchError(error => {
        console.log(`CampaignResolver load error: "${error.message}"`);
        // Because it happens server side & before resolution, `replaceUrl` seems not to
        // work, so just fall back to serving the Home content on the requested path.
        this.router.navigateByUrl('/');
        return EMPTY;
      }));

    observable.subscribe(loadedCampaign => {
      // Save in state for future routes, e.g. when moving between `CampaignDetailComponent`
      // and `DonationStartComponent`.
      this.state.set(campaignKey, loadedCampaign);
    });

    return observable;
  }
}
