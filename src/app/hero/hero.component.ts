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
  @Input() campaign: Campaign;
  @Input() description: string;
  @Input() fund?: Fund;
  @Input() reset: Observable<void>; // Passed through to CampaignSearchFormComponent
  @Input() title: string;
  @Output() heroSearch: EventEmitter<any> = new EventEmitter();

  bannerUri: string;
  fundLogoUri?: string;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.imageService.getImageUri(this.campaign.bannerUri, 2000).subscribe(uri => this.bannerUri = uri);

    if (this.fund && this.fund.logoUri) {
      this.imageService.getImageUri(this.fund.logoUri, 660).subscribe(uri => this.fundLogoUri = uri);
    }
  }

  search(term: string) {
    this.heroSearch.emit(term);
  }
}
