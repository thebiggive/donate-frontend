import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CampaignService } from './campaign.service';

@Injectable()
export class CampaignListResolver implements Resolve<any> {
  constructor(private campaignService: CampaignService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resolve(route: ActivatedRouteSnapshot) {
    const defaultListQuery = {
      limit: CampaignService.perPage,
      offset: 0,
      sortDirection: 'desc',
      sortField: 'matchFundsRemaining',
    };

    return this.campaignService.search(defaultListQuery);
  }
}
