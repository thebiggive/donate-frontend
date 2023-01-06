import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CampaignSummary } from '../campaign-summary.model';
import { PageMetaService } from '../page-meta.service';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss'],
})
export class CharityComponent implements OnInit {
  campaigns: CampaignSummary[];

  constructor(
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.campaigns = this.route.snapshot.data.campaigns;

    this.pageMeta.setCommon(
      this.campaigns[0] ? `${this.campaigns[0].charity.name} Campaigns` : 'Campaigns Archive',
      'Archive of Big Give match funded campaigns',
      this.campaigns[0]?.currencyCode !== 'GBP',
      null,
    );
  }
}
