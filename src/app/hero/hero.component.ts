import { Component, Input, OnChanges } from '@angular/core';

import { Campaign } from '../campaign.model';
import { Fund } from '../fund.model';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnChanges {
  @Input() campaign: Campaign;
  @Input() description: string;
  @Input() fund?: Fund;
  @Input() getDefaultSort: () => string;

  bannerUri: string;
  logoAltText?: string;
  /** May be a fund logo (in addition to campaign title), or campaign logo (replaces title). */
  logoUri?: string;
  /** null if there's a campaign logo instead. */
  title?: string;

  constructor(private imageService: ImageService) {}

  /**
   * Called when @Input()s are first set, and when they change. Needed
   * for fund data to be picked up reliably as it is loaded asynchronously
   * in `MetaCampaignComponent` and the input is optional.
   */
  ngOnChanges() {
    this.imageService.getImageUri(this.campaign.bannerUri, 2000).subscribe(uri => this.bannerUri = uri);

    if (this.campaign.logoUri) {
      this.logoAltText = this.campaign.title;
      this.imageService.getImageUri(this.campaign.logoUri, 660).subscribe(uri => this.logoUri = uri);
    } else if (this.fund) {
      if (this.fund.logoUri) {
        this.logoAltText = this.fund.name;
        this.title = this.campaign.title;
        this.imageService.getImageUri(this.fund.logoUri, 660).subscribe(uri => this.logoUri = uri);
      } else {
        this.title = `${this.campaign.title}: ${this.fund.name}`;
      }
    }
  }
}
