import { isPlatformBrowser } from '@angular/common';
import { Injectable, makeStateKey, PLATFORM_ID, TransferState, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { MatomoTracker } from 'ngx-matomo-client';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Campaign } from './campaign.model';
import { CampaignService, SearchQuery } from './campaign.service';
import { SearchService } from './search.service';
import { logCampaignCalloutError } from './logCampaignCalloutError';
import { MetaCampaign } from './metaCampaign.model';

@Injectable({ providedIn: 'root' })
export class CampaignResolver implements Resolve<Campaign | MetaCampaign> {
  campaignService = inject(CampaignService);
  private matomoTracker = inject(MatomoTracker);
  private platformId = inject(PLATFORM_ID);
  searchService = inject(SearchService);
  private router = inject(Router);
  private state = inject(TransferState);

  /**
   * May return either a charity campaign or a metacampaign, depending on whether a campaignId or campaignSlug
   * is passed in the route.paramMap
   *
   * @param route
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Campaign | MetaCampaign> {
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

      const isEarlyPreview: boolean = !!route.data.isEarlyPreview;
      if (isEarlyPreview) {
        return this.campaignService.getCharityCampaignPreviewById(campaignId);
      }

      return this.loadWithStateCache(campaignId, (identifier: string) =>
        this.campaignService.getCharityCampaignById(identifier),
      );
    }

    if (campaignSlug && fundSlug && campaignSlug !== 'campaign') {
      const query = this.campaignService.buildQuery(
        this.searchService.selected,
        0,
        campaignId ?? undefined,
        campaignSlug,
        fundSlug,
      );
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

    return this.loadWithStateCache(campaignSlug || '', (identifier: string) =>
      this.campaignService.getMetaCampaignBySlug(identifier),
    );
  }

  private loadWithStateCache(
    identifier: string,
    method: (identifier: string) => Observable<Campaign | MetaCampaign>,
  ): Observable<Campaign | MetaCampaign> {
    if (!this.plausibleIdentifier(identifier)) {
      // Make sure we don't do `/null` API requests, on /explore for e.g.
      return EMPTY;
    }

    const platformIndicator = isPlatformBrowser(this.platformId) ? 'browser' : 'server';
    const campaignKey = makeStateKey<Campaign | MetaCampaign>(`campaign-${identifier}-${platformIndicator}`);
    const campaign = this.state.get(campaignKey, undefined);
    if (campaign) {
      return of(campaign);
    }

    const observable = method(identifier).pipe(
      catchError((error) => {
        logCampaignCalloutError(
          isPlatformBrowser(this.platformId),
          `CampaignResolver main load: ${error.message}`,
          identifier,
          this.matomoTracker,
        );
        // Because it happens server side & before resolution, `replaceUrl` seems not to
        // work, so just fall back to serving the Home content on the requested path.
        void this.router.navigateByUrl('/');
        return EMPTY;
      }),
    );

    observable.subscribe((loadedCampaign) => {
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
