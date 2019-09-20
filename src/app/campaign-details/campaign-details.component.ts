import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';

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
    private meta: Meta,
    private route: ActivatedRoute,
    private title: Title,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
  }

  ngOnInit() {
    this.campaignService.getOne(this.campaignId)
      .subscribe(campaign => {
        this.campaign = campaign;
        this.title.setTitle(campaign.title);
        this.meta.updateTag({ name: 'description', content: `View details of the "${campaign.title}" campaign`});
      });
  }
}
