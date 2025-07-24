import { Component, inject, input, resource } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { OptimisedImagePipe } from '../optimised-image.pipe';
import { ImageService } from '../image.service';
import { firstValueFrom } from 'rxjs';

/**
 * New (July 2025) version of a banner initially to use as a heading on metacampaign pages.
 *
 * Developing for now just as an Angular component rather than in our components library to allow
 * much quicker iteration - can consider moving to components library for sharing with Wordpress when stabalised.
 *
 */
@Component({
  selector: 'app-heading-banner',
  imports: [AsyncPipe, OptimisedImagePipe, NgStyle],
  templateUrl: './heading-banner.component.html',
  styleUrl: './heading-banner.component.scss',
})
export class HeadingBanner {
  imageService = inject(ImageService);
  logo = input<{ url: string; alt: string | undefined } | undefined>();
  mainTitle = input.required<string>();
  mainImageUrl = input.required<string>();
  /** @todo onsider if we need to define a focal area box instead of just a point.
   */
  focalPoint = input.required<{ x: number; y: number }>();
  teaser = input.required<string>();
  backgroundColour = input.required<string>();
  textBackgroundColour = input.required<string>();
  textColour = input.required<string>();
  mainImageOptimisedUri = resource({
    params: () => ({ mainImageUrl: this.mainImageUrl() }),
    loader: async ({ params }) => await firstValueFrom(this.imageService.getImageUri(params.mainImageUrl, 2_000)),
  });
}
