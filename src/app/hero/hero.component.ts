import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { Campaign } from '../campaign.model';
import { Fund } from '../fund.model';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  public searchTerm: string;
  @Input() campaign: Campaign;
  @Input() description: string;
  @Input() fund?: Fund;
  @Input() reset: Observable<void>; // Passed through to CampaignSearchFormComponent

  // Listen for search term changes and set them accordingly.
  @Input()
  set term(val: string) {
    this.searchTerm = val;
  }

  @Output() heroSearch: EventEmitter<any> = new EventEmitter();

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

  search(term: string) {
    this.heroSearch.emit(term);
  }
}
