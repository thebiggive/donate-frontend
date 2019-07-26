import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../campaign.model';
import { CampaignSummary } from '../campaign-summary.model';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-meta-campaign',
  templateUrl: './meta-campaign.component.html',
  styleUrls: ['./meta-campaign.component.scss'],
})
export class MetaCampaignComponent implements OnInit {
  public campaign: Campaign;
  public children: CampaignSummary[];

  private campaignId: string;
  private viewportWidth: number; // In px. Used to vary `<mat-grid-list />`'s `cols`.

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
  }

  ngOnInit() {
    this.viewportWidth = window.innerWidth;
    this.campaignService.getOne(this.campaignId).subscribe(campaign => this.campaign = campaign);
    this.campaignService.search(this.campaignId).subscribe(campaignSummaries => this.children = campaignSummaries);
  }

  cols(): number {
    return Math.min(3, Math.floor(this.viewportWidth / 300)); // Min 300px per col; up to 3 cols
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.viewportWidth = event.target.innerWidth;
  }
}
