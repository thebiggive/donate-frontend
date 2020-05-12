import { Component, Input, OnInit } from '@angular/core';

import { CampaignSummary } from '../campaign-summary.model';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss'],
})
export class CampaignCardComponent implements OnInit {
  @Input() campaign: CampaignSummary;
  @Input() inFundContext: boolean;
  bannerUri: string;
  isFinished: boolean;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.imageService.getImageUri(this.campaign.imageUri, 830).subscribe(uri => this.bannerUri = uri);
    this.isFinished = (new Date(this.campaign.endDate) < new Date());
  }
}
