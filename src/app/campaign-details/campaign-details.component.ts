import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { PageMetaService } from '../page-meta.service';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent implements OnInit {
  public campaign: Campaign;
  public campaignId: string;
  public percentRaised?: number;

  constructor(
    private campaignService: CampaignService,
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
  }

  ngOnInit() {
    this.campaignService.getOneById(this.campaignId)
      .subscribe(campaign => {
        this.campaign = campaign;
        this.percentRaised = CampaignService.percentRaised(campaign);
        this.pageMeta.setCommon(campaign.title, `View details of the "${campaign.title}" campaign`, campaign.bannerUri);
      });
  }
}
