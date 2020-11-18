import { Component, Input, OnInit } from '@angular/core';

import { Campaign } from '../campaign.model';
import { Fund } from '../fund.model';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  @Input() campaign: Campaign;
  @Input() description: string;
  @Input() fund?: Fund;
  @Input() getDefaultSort: () => string;

  bannerUri: string;
  logoAltText?: string;
  /** May be a fund logo (in addition to campaign title), or campaign logo (replaces title). */
  logoUri?: string;
  /** Set false if there's a campaign logo instead. */
  showTitle = true;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.imageService.getImageUri(this.campaign.bannerUri, 2000).subscribe(uri => this.bannerUri = uri);

    if (this.campaign.logoUri) {
      this.logoAltText = this.campaign.title;
      this.showTitle = false;
      this.imageService.getImageUri(this.campaign.logoUri, 660).subscribe(uri => this.logoUri = uri);
    } else if (this.fund && this.fund.logoUri) {
      this.logoAltText = this.fund.name;
      this.imageService.getImageUri(this.fund.logoUri, 660).subscribe(uri => this.logoUri = uri);
    }
  }
}
