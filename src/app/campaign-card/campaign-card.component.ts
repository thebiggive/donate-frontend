import { Component, Input, OnInit } from '@angular/core';

import { CampaignSummary } from '../campaign-summary.model';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss'],
})
export class CampaignCardComponent implements OnInit {
  @Input() public campaign: CampaignSummary;
  @Input() public inFundContext: boolean;

  constructor() {}

  ngOnInit() {
  }
}
