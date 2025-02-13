import {ActivatedRouteSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError} from "rxjs/operators";
import {Observable, of} from 'rxjs';

import {CampaignService} from "./campaign.service";
import {HighlightCard} from "./highlight-cards/HighlightCard";

@Injectable()
export class HighlightCardsResolver
{
  constructor(public campaignService: CampaignService) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<HighlightCard[]> {
    return this.campaignService.getHomePageHighlightCards().pipe(
      // If the HighlightCards API has any error we still want to show the rest of the homepage, so we catch the error
      catchError(error => {
        console.error("Error fetching hompepage highlight cards", error);
        return of([]);
      })
    );
  }
}
