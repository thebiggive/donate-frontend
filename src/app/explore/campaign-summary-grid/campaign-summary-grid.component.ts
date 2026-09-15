import {
  BiggiveButton,
  BiggiveCampaignCard,
  BiggiveFormFieldSelect,
  BiggiveGrid,
  BiggivePopup,
} from '@biggive/components-angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Component, inject, input, output } from '@angular/core';
import { CampaignSummary } from '../../campaign-summary.model';
import { CampaignService } from '../../campaign.service';
import { OptimisedImagePipe } from '../../optimised-image.pipe';
import { async } from 'rxjs';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { currencyPipeDigitsInfo } from '../../../environments/common';
import { MetaCampaign } from '../../metaCampaign.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-campaign-summary-grid',
  imports: [
    BiggiveButton,
    BiggivePopup,
    BiggiveFormFieldSelect,
    FaIconComponent,
    OptimisedImagePipe,
    AsyncPipe,
    BiggiveCampaignCard,
    CurrencyPipe,
    BiggiveGrid,
    InfiniteScrollDirective,
  ],
  templateUrl: './campaign-summary-grid.component.html',
  styleUrl: './campaign-summary-grid.component.scss',
})
export class CampaignSummaryGridComponent {
  protected isInFuture = CampaignService.isInFuture;
  protected isInPast = CampaignService.isInPast;

  scrolled = output<void>();
  individualCampaigns = input.required<CampaignSummary[]>();

  async emitOnScroll() {
    this.scrolled.emit();
  }

  protected readonly async = async;
  protected readonly currencyPipeDigitsInfo = currencyPipeDigitsInfo;
  private datePipe = inject(DatePipe);

  protected metaCampaign: MetaCampaign | undefined;

  getRelevantDateAsStr(campaign: CampaignSummary) {
    const date = CampaignService.getRelevantDate(campaign);
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy, HH:mm') : null;
  }

  getPercentageRaised(childCampaign: CampaignSummary) {
    return childCampaign.parentUsesSharedFunds
      ? null
      : CampaignService.percentRaisedOfIndividualCampaign(childCampaign);
  }
}
