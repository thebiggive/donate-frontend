import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../campaign.service';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../campaign.model';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent implements OnInit {
  public campaign: Campaign;
  public campaignId: string;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
  }

  ngOnInit() {
    this.campaignService.getOne(this.campaignId)
      .subscribe(data => this.campaign = data);
  }
}
