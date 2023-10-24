import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CampaignSummary } from '../campaign-summary.model';
import { PageMetaService } from '../page-meta.service';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss'],
})
export class CharityComponent implements OnInit {
  campaigns: CampaignSummary[];

  constructor(
    private datePipe: DatePipe,
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.campaigns = this.route.snapshot.data.campaigns.sort((a: CampaignSummary, b: CampaignSummary) => {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    });

    this.pageMeta.setCommon(
      this.campaigns[0] ? `${this.campaigns[0].charity.name} Campaigns` : 'Campaigns Archive',
      'Archive of Big Give match funded campaigns',
      null,
    );
  }

  getPercentageRaised(childCampaign: CampaignSummary) {
    CampaignService.percentRaisedOfIndividualCampaign(childCampaign);
  }

  getRelevantDateAsStr(campaign: CampaignSummary) {
    const date = CampaignService.getRelevantDate(campaign);
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy, HH:mm') : null;
  }

  isInFuture(campaign: CampaignSummary) {
    return CampaignService.isInFuture(campaign);
  }

  isInPast(campaign: CampaignSummary) {
    return CampaignService.isInPast(campaign);
  }
}
