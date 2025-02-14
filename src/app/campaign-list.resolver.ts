import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { CampaignService } from './campaign.service';

@Injectable(
  {providedIn: 'root'}
)
export class CampaignListResolver  {
  constructor(private campaignService: CampaignService) {}

  resolve(_: ActivatedRouteSnapshot) {
    const defaultListQuery = {
      limit: CampaignService.perPage,
      offset: 0,
      sortDirection: 'desc',
      sortField: 'matchFundsRemaining',
    };

    return this.campaignService.search(defaultListQuery);
  }
}
