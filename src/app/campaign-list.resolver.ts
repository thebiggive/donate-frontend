import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { MatomoTracker } from 'ngx-matomo-client';

import { CampaignService } from './campaign.service';
import { logCampaignCalloutError } from './logCampaignCalloutError';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CampaignListResolver {
  private campaignService = inject(CampaignService);
  private matomoTracker = inject(MatomoTracker);
  private platformId = inject(PLATFORM_ID);


  resolve(_: ActivatedRouteSnapshot) {
    const defaultListQuery = {
      limit: CampaignService.perPage,
      offset: 0,
      sortDirection: 'desc',
      sortField: 'matchFundsRemaining',
    };

    const resolverInitialSearch = this.campaignService.search(defaultListQuery);
    resolverInitialSearch.subscribe({
      error: (error) => {
        logCampaignCalloutError(
          isPlatformBrowser(this.platformId),
          `CampaignListResolver: ${error.message}`,
          undefined,
          this.matomoTracker,
        );
      },
    });

    return resolverInitialSearch;
  }
}
