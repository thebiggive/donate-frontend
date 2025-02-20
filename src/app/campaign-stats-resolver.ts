import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {first, Observable, ReplaySubject} from 'rxjs';
import {CampaignStats} from './campaign-stats.model';
import {CampaignService} from "./campaign.service";
import {Injectable} from '@angular/core';

type FormattedCampaignStats = {
  totalRaisedFormatted: string,
  totalCountFormatted: string
};

@Injectable(
  {providedIn: 'root'}
)
export class CampaignStatsResolver implements Resolve<FormattedCampaignStats | null>{
  constructor(private campaignService: CampaignService) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<FormattedCampaignStats | null> {
    const formatTotalRaised = (totalRaised: number): string => ("£" + totalRaised.toLocaleString('en-GB'));

    const formatTotalCount = (totalCampaignCount: number): string => totalCampaignCount.toLocaleString('en-GB');

    const subject = new ReplaySubject<FormattedCampaignStats | null>();

    this.campaignService.getCampaignImpactStats()
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

    // Return the subject. Pipe in first() because resolvers
    // only emit on completion of an observable.
    return subject.pipe(first());
  }
}
