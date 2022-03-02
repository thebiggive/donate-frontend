import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../campaign.model';
import { CampaignSummary } from '../campaign-summary.model';
import { PageMetaService } from '../page-meta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  campaigns: CampaignSummary[];
  promotedCampaign1: Campaign;
  promotedCampaign2: Campaign;

  public constructor(private pageMeta: PageMetaService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.campaigns = this.route.snapshot.data.campaigns;
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
}
