import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { CampaignService, SearchQuery } from '../campaign.service';
import { CampaignSummary } from '../campaign-summary.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public campaigns: CampaignSummary[];
  public loading = false; // Server render gets initial result set; set true when filters change.
  public resetSubject: Subject<void> = new Subject<void>();

  private perPage = 6;
  private query: {[key: string]: any};

  constructor(
    private campaignService: CampaignService,
  ) {
  }

  ngOnInit() {
    this.setDefaults();
    this.run();
  }

  setDefaults() {
    this.query = {
      limit: this.perPage,
      offset: 0,
      sortDirection: 'desc',
      sortField: 'matchFundsRemaining',
    };
  }

  private run() {
    this.campaigns = [];
    this.loading = true;

    this.campaignService.search(this.query as SearchQuery).subscribe(campaignSummaries => {
      this.campaigns = campaignSummaries; // Success
      this.loading = false;
    }, () => {
        this.loading = false;
      },
    );
  }

  search(term: string) {
    // TODO DON-303 redirect to /explore page with query param
  }
}
