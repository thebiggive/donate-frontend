import { Component, Input, OnInit } from '@angular/core';

import { CampaignSummary } from '../campaign-summary.model';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss'],
})
export class CampaignCardComponent implements OnInit {
  @Input() public campaign: CampaignSummary;

  public percentRaised: number|null;

  constructor() { }

  ngOnInit() {
    this.percentRaised = this.campaign.target
      ? Math.round(100 * this.campaign.amountRaised / this.campaign.target)
      : null;
  }
}
