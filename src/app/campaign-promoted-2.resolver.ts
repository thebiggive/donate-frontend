import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CampaignService } from './campaign.service';

/**
 * One per campaign as this is a temporary workaround.
 */
@Injectable()
export class CampaignPromoted2Resolver implements Resolve<any> {
  constructor(private campaignService: CampaignService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.campaignService.getOneBySlug('christmas-challenge-2021');
  }
}
