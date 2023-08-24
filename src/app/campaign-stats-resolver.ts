import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { first, Observable, ReplaySubject } from 'rxjs';
import { CampaignStats } from './campaign-stats.model';
import { CampaignService } from "./campaign.service";

/**
 * Based on: https://stackoverflow.com/questions/51484623/angular-6-only-call-a-resolver-once
 */
@Injectable({
  providedIn: 'root'
})

export class CampaignStatsResolver  implements Resolve<number> {
  requested = false;
  // The replay subject will emit the last value that has been passed in
  subject = new ReplaySubject<{
    totalRaisedFormatted: string,
    totalCountFormatted: string
  }>();

  public constructor(
    private campaignService: CampaignService,
  ) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<any> {
      // Request data only if it has not been requested yet
      if (!this.requested) {
          this.requested = true;
          
          this.campaignService.getCampaignImpactStats()
              .subscribe((stats: CampaignStats) => {
                const totalRaisedFormatted = this.formatTotalRaised(stats.totalRaised);
                const totalCountFormatted = this.formatTotalCount(stats.totalCampaignCount);
                this.subject.next({
                  totalRaisedFormatted,
                  totalCountFormatted
                });
          });
      }
      // Return the subject. Pipe in first() because resolvers 
      // only emit on completion of an observable.
      return this.subject.pipe(first());
  }

  formatTotalRaised = (totalRaised: number): string => ("£" + totalRaised.toLocaleString('en-GB'));

  formatTotalCount = (totalCampaignCount: number): string => totalCampaignCount.toLocaleString('en-GB');
}