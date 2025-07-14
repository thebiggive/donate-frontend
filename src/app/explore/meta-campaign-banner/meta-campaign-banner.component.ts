import { Component, inject, input, resource, signal } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { OptimisedImagePipe } from '../../optimised-image.pipe';
import { ImageService } from '../../image.service';
import { firstValueFrom } from 'rxjs';

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
  imageService = inject(ImageService);
  logo = input<{ url: string; alt: string | undefined } | undefined>();
  mainTitle = input.required<string>();
  mainImageUrl = input.required<string>();

  /** Where the most important part of the image is to ensure is visible, as a percentage down and right from the
   * top left corner. @todo receive this from matchbot (and perhaps ultimately from SF). Consider if we need to define
   * a focal area box instead of just a point - probably not.
   */
  focalPoint = input({ x: 71, y: 48 });

  teaser = input.required<string>();

  /**
   *  @todo make this an input and allow to vary per metacampaign
   * Visible only when the main image is not loaded.
   * */
  backgroundColour = signal('black');

  /**
   * @todo make this an input and allow to vary per metacampaign
   **/
  textBackgroundColour = signal('white');

  /**
   * @todo make this an input and allow to vary per metacampaign
   **/
  textColour = signal('black');

  mainImageOptimisedUri = resource({
    params: () => ({ mainImageUrl: this.mainImageUrl() }),
    loader: async ({ params }) => await firstValueFrom(this.imageService.getImageUri(params.mainImageUrl, 2_000)),
  });
}
