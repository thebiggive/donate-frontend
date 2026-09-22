import { BiggiveCampaignCard, BiggiveGrid } from '@biggive/components-angular';
import { Component, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [OptimisedImagePipe, AsyncPipe, BiggiveCampaignCard, CurrencyPipe, BiggiveGrid, InfiniteScrollDirective],
  templateUrl: './campaign-summary-grid.component.html',
  styleUrl: './campaign-summary-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [DatePipe],
})
export class CampaignSummaryGridComponent {
  protected isInFuture = CampaignService.isInFuture;
  protected isInPast = CampaignService.isInPast;

  scrolled = output<void>();
  individualCampaigns = input.required<CampaignSummary[]>();

  /**
   * Max number of columns to use in grid. Ideally this might be controlled via a CSS container
   * query but that isn't supported by Safari 15.6
   */
  readonly columnCount = input.required<number>();

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
