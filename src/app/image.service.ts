import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import ModernizrAPI = __Modernizr.ModernizrAPI;

declare const Modernizr: ModernizrAPI;

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  /** Track whether we should request images converted to webp to be as small as possible on modern browsers. */
  private webp?: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  getImageUri(originalImageUri: string | null, width: number): Observable<string | null> {
    if (!originalImageUri) {
      return of(null);
    }

    const imageUri = `${originalImageUri}?width=${width}`;

    // Return immediately if we already checked for webp support on this run.
    if (this.webp) {
      return of(`${imageUri}&format=webp`);
    } else if (this.webp === false) {
      return of(imageUri);
    }

    // If client-side and we don't know about support yet, resolve an Observable when Modernizr gets back to us.
    if (isPlatformBrowser(this.platformId)) {
      const uriSubject = new Subject<string>();
      Modernizr.on('webp', (browserSupportsWebp) => {
        this.webp = browserSupportsWebp;
        uriSubject.next(this.webp ? `${imageUri}&format=webp` : imageUri);
      });

      return uriSubject.asObservable();
    }

    // If we're SSR rendering, assume webp support until proven otherwise (in client handover) to optimise for newer tech.
    return of(`${imageUri}&format=webp`);
  }
}
