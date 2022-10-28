import { Component, Input, OnInit } from '@angular/core';

import { allChildComponentImports } from '../../allChildComponentImports';
import { Campaign } from '../campaign.model';
import { ImageService } from '../image.service';

@Component({
  standalone: true,
  selector: 'app-campaign-promo-card',
  templateUrl: './campaign-promo-card.component.html',
  styleUrls: ['./campaign-promo-card.component.scss'],
  imports: [
    ...allChildComponentImports,
  ],
})
export class CampaignPromoCardComponent implements OnInit {
  @Input() campaign: Campaign;
  @Input() campaignUri: string;
  bannerUri?: string;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.imageService.getImageUri(this.campaign.bannerUri, 830).subscribe(uri => this.bannerUri = uri);
  }
}
