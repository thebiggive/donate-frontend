import { Injectable, DOCUMENT, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { environment } from '../environments/environment';
import { makeTitle } from '../BigGiveTitleStrategy';

/**
 * Encapsulates common logic for setting pages' key metadata consistently across basic HTML meta tags and
 * social sites' proprietary ones.
 */
@Injectable({
  providedIn: 'root',
})
export class PageMetaService {
  private dom = inject<Document>(DOCUMENT);
  private meta = inject(Meta);
  private router = inject(Router);
  private title = inject(Title);

  setCommon(title: string, description: string = '', imageUri: string | null = null, noIndex = false) {
    const baseUri = environment.donateUriPrefix;
    const canonicalUri = `${baseUri}${this.router.url}`;
    const links = this.dom.getElementsByTagName('link');
    // We patch the index 0 `<link />` from the source HTML. Appending a new element
    // causes some crawlers to see pages as duplicate content with different canonical
    // URLs. Angular doesn't seem to provide a more elegant abstraction
    // for manipulating `<link />`s.
    const link = links[0];
    link.setAttribute('href', canonicalUri);

    title = makeTitle(title);

    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'twitter:title', content: title });

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'twitter:description', content: description });

    if (imageUri) {
      this.meta.updateTag({ property: 'og:image', content: imageUri });
      this.meta.updateTag({ property: 'twitter:image', content: imageUri });
      this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    } else {
      this.meta.updateTag({ property: 'twitter:card', content: 'summary' });
    }

    if (noIndex) {
      this.meta.updateTag({ property: 'robots', content: 'noindex' });
    } else {
      this.meta.removeTag('robots');
    }
  }
}
