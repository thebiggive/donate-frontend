import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private isCurrentCampaignForGG1: boolean;

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

  // called by campaign-details & donation-start components to define
  // if the loaded campaign page is a GG1 specific campaign
  saveIsCurrentCampaignForGG1(isCurrentCampaignForGG1: boolean) {
    this.isCurrentCampaignForGG1 = isCurrentCampaignForGG1;
  }

  // returns true if either on GG1 homepage, or on a GG1 campaign/donation page
  getIsGoGiveOnePage() {
    return (this.currentUrl === '/gogiveone' || this.isCurrentCampaignForGG1);
  }
}
