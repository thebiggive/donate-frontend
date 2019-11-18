import { Component, Input, OnInit } from '@angular/core';

import { Campaign } from '../campaign.model';

@Component({
  selector: 'app-campaign-details-card',
  templateUrl: './campaign-details-card.component.html',
  styleUrls: ['./campaign-details-card.component.scss'],
})
export class CampaignDetailsCardComponent implements OnInit {

  @Input() public campaign: Campaign;

  constructor() { }

  ngOnInit() {
  }

}
