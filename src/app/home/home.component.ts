import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CampaignSummary } from '../campaign-summary.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  campaigns: CampaignSummary[];

  public constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.campaigns = this.route.snapshot.data.campaigns;
  }

  /**
   * Default sort when not in relevance mode because there's a search term.
   */
  getDefaultSort(): 'matchFundsRemaining' {
    return 'matchFundsRemaining';
  }
}
