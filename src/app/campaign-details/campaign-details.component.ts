import { Component, OnInit } from '@angular/core';
import {CampaignService } from '../campaign.service';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent implements OnInit {

  public campaign = [];

  constructor(
    private campaignService: CampaignService,
  ) { }

  ngOnInit() {
    this.campaignService.getCampaign()
      .subscribe(data => this.campaign = data);
  }

}
