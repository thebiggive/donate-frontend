import { Injectable } from '@angular/core';
/**
 * Support scroll resoration when using custom 'back' links e.g. to ExploreComponent showing campaign.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private lastScrollY = 0;
  private lastUrl?: string;
  private currentUrl?: string;

  isLastUrl(url: string): boolean {
    return url === this.lastUrl;
  }

  saveNewUrl(url: string): void {
    if (this.currentUrl) {
      this.lastUrl = this.currentUrl;
    }

    this.currentUrl = url;
  }

  getLastScrollY(): number {
    return this.lastScrollY;
  }

  saveLastScrollY(scrollY: number): void {
    this.lastScrollY = scrollY;
  }

  static isAllowableRedirectPath(redirectParam: string) {
    return ! redirectParam.match(/[^a-zA-Z0-9\-_\/]/);
  }

  /**
   * Ensures the path starts with exactly one leading /
   */
  static normaliseRedirectPath(path: string) {
    return '/' + path.replace(/^\/+/, '');
  }
}
