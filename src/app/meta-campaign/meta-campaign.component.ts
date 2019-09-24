import { Component, HostListener, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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
  public filterError = false;

  private campaignId: string;
  private campaignSlug: string;
  private fundSlug: string;
  private viewportWidth: number; // In px. Used to vary `<mat-grid-list />`'s `cols`.

  constructor(
    private campaignService: CampaignService,
    private meta: Meta,
    private route: ActivatedRoute,
    private title: Title,
  ) {
    route.params.pipe().subscribe(params => {
      this.campaignId = params.campaignId;
      this.campaignSlug = params.campaignSlug;
      this.fundSlug = params.fundSlug;
    });
  }

  ngOnInit() {
    this.viewportWidth = window.innerWidth;

    if (this.campaignId) {
      this.campaignService.getOneById(this.campaignId).subscribe(campaign => this.setCampaign(campaign));
    } else {
      this.campaignService.getOneBySlug(this.campaignSlug).subscribe(campaign => this.setCampaign(campaign));
    }

    const searchQuery = {
      parentCampaignId: this.campaignId,
      parentCampaignSlug: this.campaignSlug,
      fundSlug: this.fundSlug,
    };
    this.campaignService.search(searchQuery).subscribe(
      campaignSummaries => this.children = campaignSummaries, // Success
      () => this.filterError = true, // Error, e.g. slug not known
    );
  }

  cols(): number {
    return Math.min(3, Math.floor(this.viewportWidth / 300)); // Min 300px per col; up to 3 cols
  }

  /**
   * Set the campaign for the service and page metadata.
   */
  private setCampaign(campaign: Campaign) {
    this.campaign = campaign;
    this.title.setTitle(`Campaigns in ${campaign.title}`);
    this.meta.updateTag({ name: 'description', content: `Browse campaigns in ${campaign.title}`});
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.viewportWidth = event.target.innerWidth;
  }
}
