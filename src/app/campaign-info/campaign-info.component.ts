import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, inject, InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BiggiveCampaignHighlights } from '@biggive/components-angular';

import { currencyPipeDigitsInfo } from '../../environments/common';
import { CampaignGroupsService } from '../campaign-groups.service';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { TimeLeftPipe } from '../time-left.pipe';

const integerPipeToken = new InjectionToken<DecimalPipe>('integerPipe');
const openPipeToken = new InjectionToken<TimeLeftPipe>('timeLeftToOpenPipe');
const endPipeToken = new InjectionToken<TimeLeftPipe>('timeLeftToEndPipe');

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrl: './campaign-info.component.scss',
  imports: [BiggiveCampaignHighlights, FontAwesomeModule],
  providers: [
    CurrencyPipe,
    DatePipe,
    { provide: integerPipeToken, useClass: DecimalPipe },
    // TimeLeftPipes are stateful, so we need to use a separate pipe for each date.
    { provide: openPipeToken, useClass: TimeLeftPipe },
    { provide: endPipeToken, useClass: TimeLeftPipe },
  ],
})
export class CampaignInfoComponent implements OnInit {
  private currencyPipe = inject(CurrencyPipe);
  datePipe = inject(DatePipe);
  private route = inject(ActivatedRoute);
  integerPipe = inject<DecimalPipe>(integerPipeToken);
  timeLeftToOpenPipe = inject<TimeLeftPipe>(openPipeToken);
  timeLeftToEndPipe = inject<TimeLeftPipe>(endPipeToken);

  additionalImageUris: Array<string | null> = [];
  @Input({ required: true }) campaign!: Campaign;
  campaignOpen!: boolean;
  campaignFinished!: boolean;
  campaignRaised!: string; // Formatted
  campaignTarget!: string; // Formatted
  /**
   * The count of donations to the parent campaign if it shares funds, or to this
   * specific campaign otherwise.
   */
  donationCount!: number;

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
    this.campaignFinished = CampaignService.isInPast(this.campaign);
    this.campaignTarget = this.currencyPipe.transform(
      this.campaign.parentUsesSharedFunds ? this.campaign.parentTarget : this.campaign.target,
      this.campaign.currencyCode,
      'symbol',
      currencyPipeDigitsInfo,
    ) as string;
    this.campaignRaised = this.currencyPipe.transform(
      this.campaign.parentUsesSharedFunds ? this.campaign.parentAmountRaised : this.campaign.amountRaised,
      this.campaign.currencyCode,
      'symbol',
      currencyPipeDigitsInfo,
    ) as string;
    this.donationCount = this.campaign.parentUsesSharedFunds
      ? this.campaign.parentDonationCount || 0
      : this.campaign.donationCount;
  }

  getPercentageRaised(campaign: Campaign): number | undefined {
    return CampaignService.percentRaisedOfCampaignOrParent(campaign);
  }

  getBeneficiaryIcon(beneficiary: string) {
    return CampaignGroupsService.getBeneficiaryIcon(beneficiary);
  }

  getCategoryIcon(category: string) {
    return CampaignGroupsService.getCategoryIcon(category);
  }

  get championUrl() {
    // Champion ref can be an ID if there's no slug, which doesn't really work but in practice Donate
    // redirects to the overall `parentRef`. In the absence of support for non-linked names this is probably
    // the best fallback.
    let url = `/${this.campaign.parentRef}/${this.campaign.championRef}`;

    const temporaryGreggsIds = [
      'a05WS000004MEy5YAG',
      'a05WS000004HasnYAC',
      'a05WS000004PumJYAS',
      'a05WS000004GkCfYAK',
      'a05WS000004aiMnYAI',
      'a05WS000004EqZ7YAK',
      'a05WS000004ZLAXYA4',
      'a05WS000004P41JYAS',
    ];

    if (temporaryGreggsIds.includes(this.campaign.id)) {
      url = 'https://www.greggsfoundation.org.uk';
    }

    return url;
  }
}
