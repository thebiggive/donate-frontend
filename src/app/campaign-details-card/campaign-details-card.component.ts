import { Component, Input, OnInit } from '@angular/core';

import { CampaignSummary } from '../campaign-summary.model';

@Component({
  selector: 'app-campaign-details-card',
  templateUrl: './campaign-details-card.component.html',
  styleUrls: ['./campaign-details-card.component.scss']
})
export class CampaignDetailsCardComponent implements OnInit {

  @Input() public campaign: CampaignSummary;
  
  constructor() { }

  ngOnInit() {
  }

}
