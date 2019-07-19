import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../campaign.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent implements OnInit {

  public campaignId: string;
  public campaign = [];

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
  ){ 
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
  }

  ngOnInit() {
    this.campaignService.getCampaign(this.campaignId)
      .subscribe(data => this.campaign = data);
  }

}
