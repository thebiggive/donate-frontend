import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CampaignService } from './campaign.service';
import { environment } from '../environments/environment';

/**
 * One per campaign as this is a temporary workaround.
 */
@Injectable()
export class CampaignPromoted2Resolver implements Resolve<any> {
  constructor(private campaignService: CampaignService) {}

  resolve(route: ActivatedRouteSnapshot) {
    if (environment.promotedMetacampaign2Slug) {
      return this.campaignService.getOneBySlug(environment.promotedMetacampaign2Slug);
    }
    return null;
  }
}
