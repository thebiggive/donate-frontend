import { Injectable, WritableSignal } from '@angular/core';
import { HighlightCard } from './highlight-cards/HighlightCard';
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

  /**
   * This Signal's value being false doesn't necessarily mean Donate does NOT have redirects. We just check on certain
   * routes, where a ?noredirect link is most likely to be helpful or where we might actually redirect.
   */
  private possibleRedirectSignal: WritableSignal<boolean>;

  setPossibleRedirectSignal(someCampaignHasHomePageRedirect: WritableSignal<boolean>) {
    this.possibleRedirectSignal = someCampaignHasHomePageRedirect;
  }

  isLastUrl(url: string): boolean {
    return url === this.lastUrl;
  }

  saveNewUrl(url: string): void {
    if (this.currentUrl) {
      this.lastUrl = this.currentUrl;
    }

    this.currentUrl = url;
  }

  /**
   * Gets the appropriate redirect path if any. Updates `possibleRedirectSignal` value as a side effect if non-null.
   */
  getPotentialRedirectPath(highlightCards: HighlightCard[]): string|null {
    let redirectPath: string|null = null;
    highlightCards.forEach(card => {
      // CC 'Donate Today' or 'Donate Now' cards mean there should be a full page redirect (unless donor clicked
      // the logo specifically to avoid that).
      if (card.campaignFamily === 'christmasChallenge' && card.button.text.startsWith('Donate ')) {
        redirectPath = card.button.href.pathname;
      }
    });

    // At actual runtime in browser we expect this signal to be ready before redirect paths are checked because
    // `setPossibleRedirectSignal()` is called in AppComponent's constructor, but this isn't guaranteed in all
    // test contexts for now.
    if (this.possibleRedirectSignal) {
      this.possibleRedirectSignal.set(redirectPath !== null);
    }

    return redirectPath;
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
