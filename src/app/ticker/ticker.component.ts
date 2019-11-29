import { Component, Input, OnInit } from '@angular/core';

import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { Fund } from '../fund.model';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
})
export class TickerComponent implements OnInit {
  @Input() public campaign: Campaign;
  @Input() public fund?: Fund;
  public campaignOpen: boolean;
  public durationInDays: number;

  constructor() { }

  ngOnInit() {
    this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
    this.durationInDays = Math.floor((new Date(this.campaign.endDate).getTime() - new Date(this.campaign.startDate).getTime()) / 86400000);
  }
}
