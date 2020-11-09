import { Component, Input, OnInit } from '@angular/core';

import { Campaign } from '../campaign.model';
import { CampaignGroupsService } from '../campaign-groups.service';
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

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.percentRaised = CampaignService.percentRaised(this.campaign);
    this.imageService.getImageUri(this.campaign.bannerUri, 830).subscribe(uri => this.bannerUri = uri);
  }

  getBeneficiaryIcon(beneficiary: string) {
    return CampaignGroupsService.getBeneficiaryIcon(beneficiary);
  }

  getCategoryIcon(category: string) {
    return CampaignGroupsService.getCategoryIcon(category);
  }

  locations(): string|null {
    if (this.campaign.countries.length > 1) {
      return 'Multiple locations';
    }

    return this.campaign.countries[0];
  }
}
