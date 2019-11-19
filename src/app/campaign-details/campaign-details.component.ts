import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
  public clientSide: boolean;
  public donateEnabled = true;
  public percentRaised?: number;

  constructor(
    private campaignService: CampaignService,
    private pageMeta: PageMetaService,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
  }

  ngOnInit() {
    // The carousel component seems to hang rendering forever on the server side and breaks the whole app load. So for now we have
    // the template check it's running in-browser before loading the carousel at all.
    this.clientSide = isPlatformBrowser(this.platformId);

    this.campaignService.getOneById(this.campaignId)
      .subscribe(campaign => {
        this.campaign = campaign;
        this.donateEnabled = CampaignService.isOpenForDonations(campaign);
        this.percentRaised = CampaignService.percentRaised(campaign);
        // First 20 word-like things followed by …
        const summaryStart = campaign.summary.replace(new RegExp('^(([\\w\',."-]+ ){20}).*$'), '$1') + '…';
        this.pageMeta.setCommon(campaign.title, summaryStart, campaign.bannerUri);
      });
  }
}
