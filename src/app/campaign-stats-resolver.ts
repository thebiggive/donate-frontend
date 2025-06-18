import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { MatomoTracker } from 'ngx-matomo-client/projects/ngx-matomo-client/core/tracker/matomo-tracker.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CampaignService } from './campaign.service';
import { FormattedCampaignStats } from './campaign-stats.model';
import { logCampaignCalloutError } from './logCampaignCalloutError';

@Injectable({ providedIn: 'root' })
export class CampaignStatsResolver implements Resolve<FormattedCampaignStats> {
  private campaignService = inject(CampaignService);
  private matomoTracker = inject(MatomoTracker);
  private platformId = inject(PLATFORM_ID);


  resolve(_route: ActivatedRouteSnapshot): Observable<FormattedCampaignStats> {
    return this.campaignService.getCampaignImpactStats().pipe(
      // If the HighlightCards API has any error we still want to show the rest of the homepage, so we catch the error
      catchError((error) => {
        logCampaignCalloutError(
          isPlatformBrowser(this.platformId),
          `CampaignStatsResolver: ${error.message}`,
          undefined,
          this.matomoTracker,
        );
        return of({ totalRaisedFormatted: '£–', totalCountFormatted: '–' });
      }),
    );
  }
}
