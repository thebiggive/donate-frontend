import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { CampaignService } from './campaign.service';

@Injectable()
export class CampaignListResolver  {
  constructor(private campaignService: CampaignService) {}

  resolve(_: ActivatedRouteSnapshot) {
    const defaultListQuery = {
      limit: CampaignService.perPage,
      offset: 0,
      sortDirection: 'desc',
      sortField: 'matchFundsRemaining',
      // This resolver used on Explore for now, so no need to worry about closed ones.
      status: 'Active',
    };

    return this.campaignService.search(defaultListQuery);
  }
}
