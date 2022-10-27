import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { Fund } from '../fund.model';
import { TimeLeftPipe } from '../time-left.pipe';

@Component({
  standalone: true,
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
  imports: [
    CommonModule,
    CurrencyPipe,
    TimeLeftPipe,
  ],
})
export class TickerComponent implements OnInit {
  @Input() public campaign: Campaign;
  @Input() public fund?: Fund;
  public campaignInFuture: boolean; // Does not imply 0 raised, see HTML comment.
  public campaignOpen: boolean;
  public durationInDays: number;

  constructor() { }

  ngOnInit() {
    this.campaignInFuture = CampaignService.isInFuture(this.campaign);
    this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
    this.durationInDays = Math.floor((new Date(this.campaign.endDate).getTime() - new Date(this.campaign.startDate).getTime()) / 86400000);
  }
}
