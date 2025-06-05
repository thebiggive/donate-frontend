import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { currencyPipeDigitsInfo } from '../../environments/common';
import { CampaignSummary } from '../campaign-summary.model';
import { PageMetaService } from '../page-meta.service';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrl: 'charity.component.scss',

  // predates use of standalone
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class CharityComponent implements OnInit {
  campaigns!: CampaignSummary[];
  charityName: string | undefined;
  currencyPipeDigitsInfo = currencyPipeDigitsInfo;

  constructor(
    private datePipe: DatePipe,
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    let campaignsFromApi: CampaignSummary[];

    if (this.route.snapshot.data.campaigns.campaigns) {
      // using matchbot API with new response structure
      this.charityName = this.route.snapshot.data.campaigns.charityName;
      campaignsFromApi = this.route.snapshot.data.campaigns.campaigns;
    } else {
      campaignsFromApi = this.route.snapshot.data.campaigns;
      this.charityName = campaignsFromApi[0]?.charity.name;
    }

    this.campaigns = campaignsFromApi.sort((a: CampaignSummary, b: CampaignSummary) => {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    });

    this.pageMeta.setCommon(
      this.charityName ? `${this.charityName} Campaigns` : 'Campaigns Archive',
      'Archive of Big Give match funded campaigns',
      null,
    );
  }

  getPercentageRaised(childCampaign: CampaignSummary) {
    CampaignService.percentRaisedOfIndividualCampaign(childCampaign);
  }

  getRelevantDateAsStr(campaign: CampaignSummary): string | null {
    const date = CampaignService.getRelevantDate(campaign);
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy, HH:mm') : null;
  }

  isInFuture = CampaignService.isInFuture;

  isInPast = CampaignService.isInPast;
}
