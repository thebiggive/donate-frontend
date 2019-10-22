import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable, of } from 'rxjs';
import { _throw } from 'rxjs/observable/throw';

import { AnalyticsService } from './analytics.service';
import { Donation } from './donation.model';
import { DonationCreatedResponse } from './donation-created-response.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  /**
   * For the purpose of this class, each `donationCouplet` is a pairing of a donation and its corresponding
   * unique JWT. This token grants the donor who originally created a donation permission to get its current
   * status & additional data, and to cancel it if it's Pending or Reserved.
   */
  private donationCouplets: Array<{ donation: Donation, jwt: string }> = [];

  private readonly apiPath = '/donations/services/apexrest/v1.0/donations';
  private readonly resumableStatuses = ['Pending', 'Reserved'];
  private readonly storageKey = 'v1.donate.thebiggive.org.uk';

  constructor(
    private analyticsService: AnalyticsService,
    private http: HttpClient,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) {
    this.donationCouplets = this.storage.get(this.storageKey) || [];
  }

  getDonation(donationId: string): Donation | undefined {
    const donations = this.donationCouplets.filter(donationItem => {
      return (donationItem.donation.donationId === donationId);
    });

    if (donations.length === 0) {
      return undefined;
    }

    return donations[0].donation;
  }

  /**
   * Get a recent eligible-for-resuming donation to this same campaign/project, if any exists.
   */
  getResumableDonation(projectId: string): Observable<Donation | undefined> {
    // TODO we should tidy up by deleting any locally saved donations too old to be useful as part of this process

    const existingDonations = this.donationCouplets.filter(donationItem => {
      const createdDate = donationItem.donation.createdTime instanceof Date
        ? donationItem.donation.createdTime
        : new Date(donationItem.donation.createdTime);

      return (
        donationItem.donation.projectId === projectId &&              // Only bring back donations to the same project/CCampaign...
        createdDate.getTime() > ((new Date()).getTime() - 600000) &&  // ...from the past 10 minutes...
        this.resumableStatuses.includes(donationItem.donation.status) // ...with a reusable last-known status.
      );
    });

    if (existingDonations.length === 0) {
      return of(undefined); // No relevant donations to offer to resume.
    }

    // TODO We should revisit whether it's worth explicitly checking with the server for the
    // latest status before trying to reuse a donation. It adds extra calls so is probably
    // best avoided if not needed. Now that we remove donation info from local immediately
    // after cancelling on Salesforce, and as we also check the time is recent client-side,
    // it seems like it should be unnecessary. But let's keep an eye out for edge cases.

    // We have at least one existing donation that may be a candidate to re-try.
    // We'll take an arbitrary 'first' matching donation since presenting multiple to the donor would be too confusing.
    // But we first need to check with the server that it's still in a Pending or Reserved status ready to try again -
    // and check any remaining local candidates if not.
    return this.get(existingDonations[0].donation);
  }

  /**
   * Indicates whether a donation is considered successful and fully processed. This is not always 'final' - donations
   * can be refunded and exit the Collected status.
   */
  isComplete(donation: Donation): boolean {
    const completeStatuses = ['Collected', 'Paid'];

    return completeStatuses.includes(donation.status);
  }

  /**
   * Cancel donation in Salesforce to free up match funds straight away. Subscribers should `removeLocalDonation()` on success.
   */
  cancel(donation: Donation): Observable<any> {
    donation.status = 'Cancelled';

    return this.http.put<any>(
      `${environment.apiUriPrefix}${this.apiPath}/${donation.donationId}`,
      donation,
      this.getAuthHttpOptions(donation),
    );
  }

  create(donation: Donation): Observable<DonationCreatedResponse> {
    return this.http.post<DonationCreatedResponse>(
      `${environment.apiUriPrefix}${this.apiPath}`,
      donation);
  }

  get(donation: Donation): Observable<Donation> {
    return this.http.get<Donation>(
      `${environment.apiUriPrefix}${this.apiPath}/${donation.donationId}`,
      this.getAuthHttpOptions(donation),
    );
  }

  saveDonation(donation: Donation, jwt: string) {
    // Salesforce doesn't add this until after the async persist so we need to set it locally in order to later determine
    // which donations are new and eligible for reuse.
    donation.createdTime = new Date();

    this.donationCouplets.push({ donation, jwt });
    this.storage.set(this.storageKey, this.donationCouplets);
  }

  removeLocalDonation(donation: Donation) {
    this.donationCouplets.splice(
      this.donationCouplets.findIndex(donationItem => donationItem.donation.donationId === donation.donationId),
    );
    this.storage.set(this.storageKey, this.donationCouplets);
  }

  private getAuthHttpOptions(donation: Donation): { headers: HttpHeaders } {
    const donationDataItems = this.donationCouplets.filter(donationItem => donationItem.donation.donationId === donation.donationId);

    if (donationDataItems.length !== 1) {
      this.analyticsService.logError(
        'auth_jwt_error',
        `Not authorised to work with donation ${donation.donationId} to campaign ${donation.projectId}`,
      );

      return { headers: new HttpHeaders({}) };
    }

    return {
      headers: new HttpHeaders({
        'X-Tbg-Auth': donationDataItems[0].jwt,
      }),
    };
  }

  private getData(status: number) {
    return _throw({status});
  }
}
