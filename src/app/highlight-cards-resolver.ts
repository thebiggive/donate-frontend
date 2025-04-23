import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {MatomoTracker} from 'ngx-matomo-client';
import {catchError} from "rxjs/operators";
import {Observable, of} from 'rxjs';

import {CampaignService} from "./campaign.service";
import {HighlightCard} from "./highlight-cards/HighlightCard";
import {logCampaignCalloutError} from './logCampaignCalloutError';
import {isPlatformBrowser} from '@angular/common';

@Injectable(
  {providedIn: 'root'}
)
export class HighlightCardsResolver implements Resolve<readonly HighlightCard[]>{
  constructor(
    private campaignService: CampaignService,
    private matomoTracker: MatomoTracker,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  resolve(_route: ActivatedRouteSnapshot) : Observable<readonly HighlightCard[]> {
    return this.campaignService.getHomePageHighlightCards().pipe(
      // If the HighlightCards API has any error we still want to show the rest of the homepage, so we catch the error
      catchError(error => {
        logCampaignCalloutError(isPlatformBrowser((this.platformId)), `HighlightCardsResolver: ${error.message}`, undefined, this.matomoTracker);
        return of([]);
      })
    );
  }
}
