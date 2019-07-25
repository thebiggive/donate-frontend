import { Component, HostListener, OnInit } from '@angular/core';
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
  private viewportWidth: number; // In px. Used to vary `<mat-grid-list />`'s `cols`.

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
  ) {
    route.queryParams.forEach((params: Params) => {
      this.parentCampaignId = params.campaign;
      this.term = params.term;
      this.search();
    });
  }

  ngOnInit() {
    this.viewportWidth = window.innerWidth;
  }

  cols(): number {
    return Math.min(3, Math.floor(this.viewportWidth / 300)); // Min 300px per col; up to 3 cols
  }

  public search() {
    const service = this;
    this.campaignService.search(this.parentCampaignId, this.term)
      .subscribe(campaignSummaries => {
        this.campaigns = campaignSummaries;
        service.searched = true;
      });
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.viewportWidth = event.target.innerWidth;
  }
}
