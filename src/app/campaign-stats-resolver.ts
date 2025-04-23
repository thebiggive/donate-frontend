import {isPlatformBrowser} from '@angular/common';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {MatomoTracker} from 'ngx-matomo-client';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {CampaignService} from "./campaign.service";
import {FormattedCampaignStats} from './campaign-stats.model';
import {logCampaignCalloutError} from './logCampaignCalloutError';

@Injectable(
  {providedIn: 'root'}
)
export class CampaignStatsResolver implements Resolve<FormattedCampaignStats>{
  constructor(
    private campaignService: CampaignService,
    private matomoTracker: MatomoTracker,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<FormattedCampaignStats> {
    return this.campaignService.getCampaignImpactStats().pipe(
      // If the HighlightCards API has any error we still want to show the rest of the homepage, so we catch the error
      catchError(error => {
        logCampaignCalloutError(isPlatformBrowser((this.platformId)), `CampaignStatsResolver: ${error.message}`, undefined, this.matomoTracker);
        return of({totalRaisedFormatted: '£–', totalCountFormatted: '–'});
      })
    );
  }
}
