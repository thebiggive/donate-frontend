import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CampaignService } from './campaign.service';
import { environment } from '../environments/environment';

/**
 * One per campaign as this is a temporary workaround.
 */
@Injectable()
export class CampaignPromoted1Resolver implements Resolve<any> {
  constructor(private campaignService: CampaignService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.campaignService.getOneBySlug(environment.promotedMetacampaign1Slug);
  }
}
