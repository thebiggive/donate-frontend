import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CampaignSummary } from '../campaign-summary.model';

@Component({
  standalone: true,
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss'],
})
export class CharityComponent implements OnInit {
  campaigns: CampaignSummary[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.campaigns = this.route.snapshot.data.campaigns;
  }
}
