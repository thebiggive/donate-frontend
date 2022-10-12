import { Component, Input } from '@angular/core';

import { Campaign } from '../campaign.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-promoted-campaigns',
  templateUrl: './promoted-campaigns.component.html',
  styleUrls: ['./promoted-campaigns.component.scss']
})
export class PromotedCampaignsComponent {
  @Input() campaign1: Campaign;
  @Input() campaign2: Campaign;
  campaign1Slug = environment.promotedMetacampaign1Slug;
  campaign2Slug = environment.promotedMetacampaign2Slug;
  title: string = 'Promoted campaigns';

  constructor(
  ) {
    if (!this.campaign2Slug) {
      // singular form, not plural form.
      this.title = 'Promoted campaign';
    }
  }
}
