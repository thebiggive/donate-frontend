import {isPlatformBrowser} from '@angular/common';
import {Inject, Injectable, makeStateKey, PLATFORM_ID, TransferState} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {MatomoTracker} from 'ngx-matomo-client';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Campaign } from './campaign.model';
import {CampaignService, SearchQuery} from './campaign.service';
import {SearchService} from "./search.service";
import {logCampaignCalloutError} from './logCampaignCalloutError';

@Injectable(
  {providedIn: 'root'}
)
export class CampaignResolver implements Resolve<Campaign>  {
  constructor(
    public campaignService: CampaignService,
    private matomoTracker: MatomoTracker,
    @Inject(PLATFORM_ID) private platformId: object,
    public searchService: SearchService,
    private router: Router,
    private state: TransferState,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Campaign> {
    const campaignId = route.paramMap.get('campaignId');
    const campaignSlug = route.paramMap.get('campaignSlug');
    const fundSlug = route.paramMap.get('fundSlug');

    // No . expected in slugs, and these are typically part of opportunistic junk requests.
    if (campaignSlug && campaignSlug.match(new RegExp('[.]+'))) {
      console.log(`CampaignResolver skipping load attempt for junk slug: "${campaignSlug}"`);
      // Because it happens server side & before resolution, `replaceUrl` seems not to
      // work, so just fall back to serving the Home content on the requested path.
      void this.router.navigateByUrl('/');
      return EMPTY;
    }

    if (campaignId) {
      if (campaignId.match(new RegExp('[./]+'))) {
        console.log(`CampaignResolver skipping load attempt for junk id: "${campaignId}"`);
        void this.router.navigateByUrl('/');
        return EMPTY;
      }

      return this.loadWithStateCache(
        campaignId,
        (identifier: string) => this.campaignService.getOneById(identifier),
      );
    }

    if (campaignSlug && fundSlug && campaignSlug !== "campaign") {
      const query = this.campaignService.buildQuery(this.searchService.selected, 0, campaignId ?? undefined, campaignSlug, fundSlug);
      this.campaignService.search(query as SearchQuery).subscribe({
        next: () => {},
        error: () => {
          logCampaignCalloutError(
            isPlatformBrowser(this.platformId),
            'CampaignResolver search to check fundSlug validity',
            `/${campaignSlug}/${fundSlug}`,
            this.matomoTracker,
          );
          void this.router.navigateByUrl(`/${campaignSlug}`);
        },
      });
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
    if (!this.plausibleIdentifier(identifier)) { // Make sure we don't do `/null` API requests, on /explore for e.g.
      return EMPTY;
    }

    const platformIndicator = isPlatformBrowser(this.platformId) ? 'browser' : 'server';
    const campaignKey = makeStateKey<Campaign>(`campaign-${identifier}-${platformIndicator}`);
    const campaign = this.state.get(campaignKey, undefined);
    if (campaign) {
      return of(campaign);
    }

    const observable = method(identifier)
      .pipe(catchError(error => {
        logCampaignCalloutError(isPlatformBrowser(this.platformId), `CampaignResolver main load: ${error.message}`, identifier, this.matomoTracker);
        // Because it happens server side & before resolution, `replaceUrl` seems not to
        // work, so just fall back to serving the Home content on the requested path.
        void this.router.navigateByUrl('/');
        return EMPTY;
      }));

    observable.subscribe(loadedCampaign => {
      // Save in state for future routes, e.g. when moving between `CampaignDetailComponent`
      // and `DonationStartComponent`.
      this.state.set(campaignKey, loadedCampaign);
    });

    return observable;
  }

  /**
   * Makes sure we aren't doing API requests for clearly off "slugs", including if dev mode SSR
   * is being used and the `/d/` base doesn't totally make sense. Mostly this would happen on `/explore`
   * historically, where there is no actual ID or slug in the route params.
   */
  private plausibleIdentifier(identifier: string): boolean {
    return !!identifier && identifier !== 'd' && identifier !== 'null';
  }
}
