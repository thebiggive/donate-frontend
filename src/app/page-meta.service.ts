import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

/**
 * Encapsulates common logic for setting pages' key metadata consistently across basic HTML meta tags and
 * social sites' proprietary ones.
 */
@Injectable({
  providedIn: 'root',
})
export class PageMetaService {
  constructor(
    @Inject(DOCUMENT) private dom: any,
    private meta: Meta,
    private router: Router,
    private title: Title,
  ) {}

  setCommon(title: string, description: string, useGlobal: boolean, imageUri?: string) {
    const baseUri = useGlobal ? environment.donateGlobalUriPrefix : environment.donateUriPrefix;
    const canonicalUri = `${baseUri}${this.router.url}`;
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', canonicalUri);

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
