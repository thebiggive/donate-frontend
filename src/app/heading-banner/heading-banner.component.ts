import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, resource } from '@angular/core';
import { ImageService } from '../image.service';
import { firstValueFrom } from 'rxjs';

/**
 * Banner component for use as a page header.
 *
 * This component delegates to the biggive-heading-banner Stencil component from the components library.
 * It handles image optimization and passes all properties to the Stencil component.
 */
@Component({
  selector: 'app-heading-banner',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './heading-banner.component.html',
})
export class HeadingBanner {
  imageService = inject(ImageService);
  logo = input<{ url: string; alt: string | undefined } | undefined>();
  /** Optional slightly smaller text to appear above the main title */
  slug = input('');

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

  /**
   * Tall version mainly intended for meta-campaigns, short for everything else.
   * But we may find other places we want the tall image.
   */
  height = input.required<'short' | 'tall'>();
}
