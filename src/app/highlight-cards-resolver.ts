import {HighlightCard} from "./highlight-cards/HighlightCard";
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {CampaignService} from "./campaign.service";
import {catchError} from "rxjs/operators";
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable(
  {providedIn: 'root'}
)
export class HighlightCardsResolver implements Resolve<readonly HighlightCard[]>{
  constructor(private campaignService: CampaignService) {}

  resolve(_route: ActivatedRouteSnapshot) : Observable<readonly HighlightCard[]> {
    return this.campaignService.getHomePageHighlightCards().pipe(
      // If the HighlightCards API has any error we still want to show the rest of the homepage, so we catch the error
      catchError(error => {
        console.error("Error fetching hompepage highlight cards", error);
        return of([]);
      })
    );
  }
}
