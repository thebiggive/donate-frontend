import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {first, ReplaySubject} from 'rxjs';
import {CampaignStats} from './campaign-stats.model';
import {CampaignService} from "./campaign.service";
import {inject} from "@angular/core";

type FormattedCampaignStats = {
  totalRaisedFormatted: string,
  totalCountFormatted: string
};

export const campaignStatsResolver: ResolveFn<FormattedCampaignStats> = (_route: ActivatedRouteSnapshot) => {

  const formatTotalRaised = (totalRaised: number): string => ("£" + totalRaised.toLocaleString('en-GB'));

  const formatTotalCount = (totalCampaignCount: number): string => totalCampaignCount.toLocaleString('en-GB');

  const campaignService = inject(CampaignService);

  const subject = new ReplaySubject<FormattedCampaignStats>();

  let requested = false;
  // Request data only if it has not been requested yet
  if (!requested) {
    requested = true;

    campaignService.getCampaignImpactStats()
      .subscribe((stats: CampaignStats) => {
        const totalRaisedFormatted = formatTotalRaised(stats.totalRaised);
        const totalCountFormatted = formatTotalCount(stats.totalCampaignCount);
        subject.next({
          totalRaisedFormatted,
          totalCountFormatted
        });
      });
  }
  // Return the subject. Pipe in first() because resolvers
  // only emit on completion of an observable.
  return subject.pipe(first());
};
