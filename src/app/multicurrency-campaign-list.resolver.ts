import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CampaignService } from './campaign.service';

@Injectable()
export class MulticurrencyCampaignListResolver implements Resolve<any> {
  constructor(private campaignService: CampaignService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.campaignService.search({
      parentSlug: route.url[0].path, // Get children of the specific page/slug loaded.
      limit: 100, // We really want *all* children so we can be sure we have all country defaults.
      offset: 0,
      sortDirection: 'desc',
      sortField: 'matchFundsRemaining',
    });
  }
}
