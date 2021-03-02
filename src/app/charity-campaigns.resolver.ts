import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CampaignService } from './campaign.service';
import { of } from 'rxjs';

@Injectable()
export class CharityCampaignsResolver implements Resolve<any> {
  constructor(private campaignService: CampaignService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const charityId = route.paramMap.get('charityId');

    if (!charityId || charityId === 'null') {
      return of([]);
    }

    return this.campaignService.getForCharity(charityId);
  }
}
