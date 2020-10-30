import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { CampaignService, SearchQuery } from '../campaign.service';
import { CampaignSummary } from '../campaign-summary.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  public campaigns: CampaignSummary[];
  public loading = false; // Server render gets initial result set; set true when filters change.
  public resetSubject: Subject<void> = new Subject<void>();
  public videoEmbedUrl: SafeResourceUrl;
  public youtubeId = '5RWDzzBg-go';

  private perPage = 6;
  private query: {[key: string]: any};

  constructor(
    private campaignService: CampaignService,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.setDefaults();
    this.run();
    this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.youtubeId}`);
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
