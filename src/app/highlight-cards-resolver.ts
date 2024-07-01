import {HighlightCard} from "./highlight-cards/HighlightCard";
import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {CampaignService} from "./campaign.service";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";

export const highlightCardsResolver: ResolveFn<readonly HighlightCard[]> = () => {
  return inject(CampaignService).getHomePageHighlightCards().pipe(
    // If the HighlightCards API has any error we still want to show the rest of the homepage, so we catch the error
    catchError(error => {
      console.error("Error fetching hompepage highlight cards", error);
      return of([]);
    })
  );
}
