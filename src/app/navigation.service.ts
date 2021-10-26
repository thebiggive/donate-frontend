import { Injectable } from '@angular/core';

/**
 * Support scroll resoration when using custom 'back' links e.g. to MetacampaignComponent.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private lastSingleCampaignId?: string;
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

  getLastSingleCampaignId(): string | undefined {
    return this.lastSingleCampaignId;
  }

  saveLastSingleCampaignId(campaignId: string) {
    this.lastSingleCampaignId = campaignId;
  }
}
