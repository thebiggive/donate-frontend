import { DatePipe } from '@angular/common';
import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { currencyPipeDigitsInfo } from '../../environments/common';
import { CampaignSummary } from '../campaign-summary.model';
import { PageMetaService } from '../page-meta.service';
import { CampaignService } from '../campaign.service';
import {allChildComponentImports} from '../../allChildComponentImports';
import {OptimisedImagePipe} from '../optimised-image.pipe';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrl: 'charity.component.scss',
  standalone: true,
  imports: [
    ...allChildComponentImports,
    OptimisedImagePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CharityComponent implements OnInit {
  campaigns: CampaignSummary[];
  currencyPipeDigitsInfo = currencyPipeDigitsInfo;

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

  getRelevantDateAsStr(campaign: CampaignSummary): string | null {
    const date = CampaignService.getRelevantDate(campaign);
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy, HH:mm') : null;
  }

  isInFuture = CampaignService.isInFuture;

  isInPast = CampaignService.isInPast;
}
