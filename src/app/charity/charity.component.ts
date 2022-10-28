import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { allChildComponentImports } from '../../allChildComponentImports';
import { CampaignCardComponent } from '../campaign-card/campaign-card.component';
import { CampaignSummary } from '../campaign-summary.model';

@Component({
  standalone: true,
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss'],
  imports: [
    ...allChildComponentImports,
    CampaignCardComponent,
  ],
})
export class CharityComponent implements OnInit {
  campaigns: CampaignSummary[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.campaigns = this.route.snapshot.data.campaigns;
  }
}
