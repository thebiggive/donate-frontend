import { Component, Input } from '@angular/core';

import { Campaign } from '../campaign.model';

@Component({
  selector: 'app-promoted-campaigns',
  templateUrl: './promoted-campaigns.component.html',
  styleUrls: ['./promoted-campaigns.component.scss']
})
export class PromotedCampaignsComponent {
  @Input() campaign1: Campaign;
  @Input() campaign2: Campaign;
  constructor(
  ) {}
}
