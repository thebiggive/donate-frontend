import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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

  private parentCampaignId: string;
  private term: string;

  constructor(
    private campaignService: CampaignService,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
  ) {
    route.queryParams.forEach((params: Params) => {
      this.parentCampaignId = params.parent;
      this.term = params.term;
      this.search();
    });
  }

  ngOnInit() {
  }

  public search() {
    const service = this;
    this.campaignService.search({parentCampaignId: this.parentCampaignId, term: this.term})
      .subscribe(campaignSummaries => {
        this.campaigns = campaignSummaries;
        service.searched = true;
      });
  }
}
