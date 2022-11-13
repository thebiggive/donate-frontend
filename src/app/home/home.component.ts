import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';

import { allChildComponentImports } from '../../allChildComponentImports';
import { Campaign } from '../campaign.model';
import { CampaignCardComponent } from '../campaign-card/campaign-card.component';
import { CampaignSummary } from '../campaign-summary.model';
import { PageMetaService } from '../page-meta.service';
import { PromotedCampaignsComponent } from '../promoted-campaigns/promoted-campaigns.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    ...allChildComponentImports,
    CampaignCardComponent,
    FlexLayoutModule,
    PromotedCampaignsComponent,
  ]
})
export class HomeComponent implements OnInit {
  campaigns: CampaignSummary[];
  promotedCampaign1: Campaign;
  promotedCampaign2: Campaign;
  mainTitle = 'Matching Donations.\nMultiplying Impact.';
  highlightCard1Title = 'Double your donation\nin the Christmas Challenge 2022';
  highlightCard1Subtitle = 'Donate between\n29 Nov – 6 Dec';

  public constructor(private pageMeta: PageMetaService, private route: ActivatedRoute) {}

  ngOnInit() {
    // For now, we share the resolver with Explore, so it gives us the up-to-6 campaigns from
    // the API directly, with no further constraints. We need to check their suitability here.
    this.campaigns = this.getHighlightReadyCampaigns(this.route.snapshot.data.campaigns);
    this.promotedCampaign1 = this.route.snapshot.data.promotedMetacampaign1;
    this.promotedCampaign2 = this.route.snapshot.data.promotedMetacampaign2;
    this.pageMeta.setCommon(
      'The Big Give',
      'The Big Give &ndash; discover campaigns and donate',
      false,
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );
  }

  /**
   * Default sort when not in relevance mode because there's a search term.
   */
  getDefaultSort(): 'matchFundsRemaining' {
    return 'matchFundsRemaining';
  }

  /**
   * Returns either 3 or 0 campaigns to highlight, depending on the number of suitable summaries passed in.
   */
  private getHighlightReadyCampaigns(campaignSummaries: CampaignSummary[]): CampaignSummary[] {
    const targetLength = 3;
    const suitableCampaigns = [];

    for (const campaignSummary of campaignSummaries) {
      if (campaignSummary.matchFundsRemaining > 0 && campaignSummary.amountRaised >= 100) {
        suitableCampaigns.push(campaignSummary);
        if (suitableCampaigns.length === targetLength) {
          break;
        }
      }
    }

    if (suitableCampaigns.length < targetLength) {
      return [];
    }

    return suitableCampaigns;
  }
}
