import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {first, Observable, of, ReplaySubject} from 'rxjs';
import {CampaignStats} from './campaign-stats.model';
import {CampaignService} from "./campaign.service";
import {inject} from "@angular/core";

export type FormattedCampaignStats = {
  totalRaisedFormatted: string,
  totalCountFormatted: string
};

export const campaignStatsResolver: ResolveFn<FormattedCampaignStats | null> = (_route: ActivatedRouteSnapshot): Observable<FormattedCampaignStats | null> => {
  return of(null);

  const formatTotalRaised = (totalRaised: number): string => ("£" + totalRaised.toLocaleString('en-GB'));

  const formatTotalCount = (totalCampaignCount: number): string => totalCampaignCount.toLocaleString('en-GB');

  const campaignService = inject(CampaignService);

  const subject = new ReplaySubject<FormattedCampaignStats | null>();

  let requested = false;
  // Request data only if it has not been requested yet
  if (!requested) {
    requested = true;

    campaignService.getCampaignImpactStats()
      .subscribe({
        next: (stats: CampaignStats) => {
        const totalRaisedFormatted = formatTotalRaised(Math.floor(stats.totalRaised));
        const totalCountFormatted = formatTotalCount(stats.totalCampaignCount);
        subject.next({
          totalRaisedFormatted,
          totalCountFormatted
        });
        },
          error: (err) => {
            console.log("Campaign stats API resolved with an error: ");
            console.error(err);
            subject.next(null);
        }
      });
  }
  // Return the subject. Pipe in first() because resolvers
  // only emit on completion of an observable.
  return subject.pipe(first());
};
