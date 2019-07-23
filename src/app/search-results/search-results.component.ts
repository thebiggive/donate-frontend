import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CampaignService } from '../campaign.service';
import { CampaignSummary } from '../campaign-summary.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  public campaigns: CampaignSummary[];
  public searched = false;

  private term: string;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
  ) {
    route.queryParams.forEach((params: Params) => {
      this.term = params.term;
      this.search();
    });
  }

  ngOnInit() {
  }

  public search() {
    const service = this;
    this.campaignService.search(this.term)
      .subscribe(campaignSummaries => {
        this.campaigns = campaignSummaries;
        service.searched = true;
      });
  }
}
