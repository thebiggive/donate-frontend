import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/**
 * Encapsulates common logic for setting pages' key metadata consistently across basic HTML meta tags and
 * social sites' proprietary ones.
 */
@Injectable({
  providedIn: 'root',
})
export class PageMetaService {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {}

  setCommon(title: string, description: string, imageUri?: string) {
    this.title.setTitle(title);
    this.meta.updateTag( { property: 'og:title', content: title } );
    this.meta.updateTag( { property: 'twitter:title', content: title } );

    this.meta.updateTag({ name: 'description', content: description});
    this.meta.updateTag( { property: 'og:description', content: description } );
    this.meta.updateTag( { property: 'twitter:description', content: description } );

    if (imageUri) {
      this.meta.updateTag( { property: 'og:image', content: imageUri } );
      this.meta.updateTag( { property: 'twitter:image', content: imageUri } );
      this.meta.updateTag( { property: 'twitter:card', content: 'summary_large_image' } );
    } else {
      this.meta.updateTag( { property: 'twitter:card', content: 'summary' } );
    }
  }
}
