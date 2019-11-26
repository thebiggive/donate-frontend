import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

import { Campaign } from '../campaign.model';
import { Fund } from '../fund.model';

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

  /**
   * Dynamically use the smallest supported image format. Default to true to optimise
   * server-client handover for modern browsers that are likely to load the image itself
   * faster. On the client side, Modernizr jumps in asynchroously in `ngOnInit()` and
   * switches the background over to the png, on browsers that need it.
   */
  public webp = true;

  // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // The server doesn't know what's rendering the page, so can't check for webp support
    if (isPlatformBrowser(this.platformId)) {
      Modernizr.on('webp', browserSupportsWebp => this.webp = browserSupportsWebp);
    }
  }

  search(term: string) {
    this.heroSearch.emit(term);
  }
}
