import {Component, Input} from '@angular/core';
import {HighlightCard} from "../highlight-cards/HighlightCard";
import {ComponentsModule} from "@biggive/components-angular";
import {CampaignSummary} from "../campaign-summary.model";
import {CampaignService} from "../campaign.service";
import {AsyncPipe, CurrencyPipe, DatePipe} from "@angular/common";
import {currencyPipeDigitsInfo} from '../../environments/common';
import {OptimisedImagePipe} from "../optimised-image.pipe";

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  styleUrl: 'campaign-card.component.scss',
  imports: [
    ComponentsModule, CurrencyPipe, DatePipe, AsyncPipe, OptimisedImagePipe
  ],
  templateUrl: './campaign-card.component.html',
  providers: [
    CurrencyPipe,
    DatePipe,
    ]
})
export class CampaignCardComponent {
  @Input({ required: true }) protected campaign: CampaignSummary;

  @Input({ required: true }) protected useSharedFunds: boolean;

  isInFuture = CampaignService.isInFuture;

  isInPast = CampaignService.isInPast;

  currencyPipeDigitsInfo = currencyPipeDigitsInfo;

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
  ) {

  }

  getRelevantDateAsStr(campaign: CampaignSummary): string | null {
    const date = CampaignService.getRelevantDate(campaign);
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy, HH:mm') : null;
  }

  getPercentageRaised(childCampaign: CampaignSummary) {
    if (this.useSharedFunds) {
      // No progressbar on child cards when parent is e.g. a shared fund emergency appeal.
      return null;
    }

    return CampaignService.percentRaisedOfIndividualCampaign(childCampaign);
  }
}
