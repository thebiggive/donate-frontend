import { Component, input, signal } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { OptimisedImagePipe } from '../../optimised-image.pipe';

/**
 * New (July 2025) version of a banner initially to use as a heading on metacampaign pages.
 *
 * Developing for now just as an Angular component rather than in our components library to allow
 * much quicker iteration - can consider moving to components library for sharing with Wordpress when stabalised.
 *
 */
@Component({
  selector: 'app-meta-campaign-banner',
  imports: [AsyncPipe, OptimisedImagePipe, NgStyle],
  templateUrl: './meta-campaign-banner.component.html',
  styleUrl: './meta-campaign-banner.component.scss',
})
export class MetaCampaignBannerComponent {
  logo = input<{ url: string; alt: string | undefined } | undefined>();
  mainTitle = input.required<string>();
  mainImageUrl = input.required<string>();
  teaser = input.required<string>();

  /**
   *  @todo make this an input and allow to vary per metacampaign
   * Visible only when the main image is not loaded.
   * */
  backgroundColour = signal('black');

  /**
   * @todo make this an input and allow to vary per metacampaign
   **/
  textColour = signal('white');
}
