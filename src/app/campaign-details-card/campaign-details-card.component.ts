import { Component, Input, OnInit } from '@angular/core';

import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-campaign-details-card',
  templateUrl: './campaign-details-card.component.html',
  styleUrls: ['./campaign-details-card.component.scss'],
})
export class CampaignDetailsCardComponent implements OnInit {
  @Input() public campaign: Campaign;
  public percentRaised?: number;

  constructor() { }

  ngOnInit() {
    this.percentRaised = CampaignService.percentRaised(this.campaign);
  }
}
