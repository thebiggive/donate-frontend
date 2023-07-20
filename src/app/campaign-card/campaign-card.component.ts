import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { allChildComponentImports } from '../../allChildComponentImports';
import { CampaignGroupsService } from '../campaign-groups.service';
import { CampaignSummary } from '../campaign-summary.model';
import { ImageService } from '../image.service';

/**
 * @deprecated Remove once Charity page is using the Stencil counterpart.
 */
@Component({
  standalone: true,
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss'],
  imports: [
    ...allChildComponentImports,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CampaignCardComponent implements OnInit {
  @Input({ required: true }) campaign: CampaignSummary;
  @Input() inFundContext: boolean;
  bannerUri: string|null = null;
  isFinished: boolean;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.imageService.getImageUri(this.campaign.imageUri, 830).subscribe(uri => this.bannerUri = uri);
    this.isFinished = (new Date(this.campaign.endDate) < new Date());
  }

  getBeneficiaryIcon(beneficiary: string) {
    return CampaignGroupsService.getBeneficiaryIcon(beneficiary);
  }

  getCategoryIcon(category: string) {
    return CampaignGroupsService.getCategoryIcon(category);
  }
}
