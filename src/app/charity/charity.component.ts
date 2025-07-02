import { DatePipe, AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { currencyPipeDigitsInfo } from '../../environments/common';
import { CampaignSummary } from '../campaign-summary.model';
import { PageMetaService } from '../page-meta.service';
import { CampaignService } from '../campaign.service';
import { BiggiveGrid, BiggiveCampaignCard } from '@biggive/components-angular';
import { OptimisedImagePipe } from '../optimised-image.pipe';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrl: 'charity.component.scss',
  imports: [RouterLink, BiggiveGrid, BiggiveCampaignCard, AsyncPipe, CurrencyPipe, OptimisedImagePipe],
  providers: [DatePipe],
})
export class CharityComponent implements OnInit {
  private datePipe = inject(DatePipe);
  private pageMeta = inject(PageMetaService);
  private route = inject(ActivatedRoute);

  campaigns!: CampaignSummary[];
  charityName: string | undefined;
  currencyPipeDigitsInfo = currencyPipeDigitsInfo;

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
