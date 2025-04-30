import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { MatomoTracker } from 'ngx-matomo-client';

import { CampaignService } from './campaign.service';
import { logCampaignCalloutError } from './logCampaignCalloutError';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CampaignListResolver {
  constructor(
    private campaignService: CampaignService,
    private matomoTracker: MatomoTracker,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

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
