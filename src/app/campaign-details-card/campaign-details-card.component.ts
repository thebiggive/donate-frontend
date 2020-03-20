import { Component, Input, OnInit } from '@angular/core';

import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-campaign-details-card',
  templateUrl: './campaign-details-card.component.html',
  styleUrls: ['./campaign-details-card.component.scss'],
})
export class CampaignDetailsCardComponent implements OnInit {
  @Input() campaign: Campaign;
  bannerUri: string;
  percentRaised?: number;

  // TODO remove temporary flag after COVID-19
  showTemporaryTarget = false;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.percentRaised = CampaignService.percentRaised(this.campaign);
    this.imageService.getImageUri(this.campaign.bannerUri, 830).subscribe(uri => this.bannerUri = uri);

    // TODO remove temporary flag logic after COVID-19
    if (this.campaign.target < 1000000 && this.campaign.parentRef === 'covid-19') {
      this.showTemporaryTarget = true;
    }
  }
}
