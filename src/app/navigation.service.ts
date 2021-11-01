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
  private isGG1PageEvent = new BehaviorSubject<boolean>(false);

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

  emitIsGG1PageEvent(isGG1Page: boolean) {
    this.isGG1PageEvent.next(isGG1Page);
  }

  isGG1PageEventListener() {
    return this.isGG1PageEvent.asObservable();
  }
}
