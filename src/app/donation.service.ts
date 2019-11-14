import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable, of } from 'rxjs';

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

  private readonly apiPath = '/donations';
  private readonly resumableStatuses = ['Pending', 'Reserved'];
  private readonly storageKey = 'v1.donate.thebiggive.org.uk';

  constructor(
    private analyticsService: AnalyticsService,
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private storage: StorageService,
  ) {}

  getDonation(donationId: string): Donation | undefined {
    const couplet = this.getLocalDonationCouplet(donationId);

    if (!couplet) {
      return undefined;
    }

    return couplet.donation;
  }

  isResumable(donation: Donation): boolean {
    return this.resumableStatuses.includes(donation.status);
  }

  /**
   * Get a recent eligible-for-resuming donation to this same campaign/project, if any exists. We look
   * for candidates based on local status initially but return an Observable resulting from a re-GET
   * so we include the latest server status. This is why this private method only knows the donation is
   * 'probably' resumable.
   */
  getProbablyResumableDonation(projectId: string): Observable<Donation | undefined> {
    this.removeOldLocalDonations();

    const existingDonations = this.getDonationCouplets().filter(donationItem => {
      return (
        donationItem.donation.projectId === projectId && // Only bring back donations to the same project/CCampaign...
        this.getCreatedTime(donationItem.donation) > ((new Date()).getTime() - 600000) && // ...from the past 10 minutes...
        this.isResumable(donationItem.donation) // ...with a reusable last-known status.
      );
    });

    if (existingDonations.length === 0) {
      return of(undefined); // No relevant donations to offer to resume.
    }

    // We have at least one existing donation that may be a candidate to re-try.
    // We'll take an arbitrary 'first' matching donation since presenting multiple to the donor would be too confusing.
    return this.get(existingDonations[0].donation);
  }

  /**
   * Update a local copy of a Donation that we already expect to have saved, leaving its
   * JWT in tact so that e.g. its details can still be loaded on the thank you page.
   */
  updateLocalDonation(donation: Donation) {
    const couplet = this.getLocalDonationCouplet(donation.donationId);

    if (!couplet) {
      return; // Just bail out if there's no match we can safely update.
    }

    const jwt = couplet.jwt;
    this.removeLocalDonation(donation);
    this.saveDonation(donation, jwt);
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
      `${environment.donationsApiPrefix}${this.apiPath}/${donation.donationId}`,
      donation,
      this.getAuthHttpOptions(donation),
    );
  }

  create(donation: Donation): Observable<DonationCreatedResponse> {
    return this.http.post<DonationCreatedResponse>(
      `${environment.donationsApiPrefix}${this.apiPath}`,
      donation);
  }

  get(donation: Donation): Observable<Donation> {
    return this.http.get<Donation>(
      `${environment.donationsApiPrefix}${this.apiPath}/${donation.donationId}`,
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

  /**
   * Safely get created date from a Donation, whether the local data has it as a Date (e.g. when set locally) or
   * a string (when just derived from an HTTP response), and return it as a JavaScript Unix epoch milliseconds value.
   */
  private getCreatedTime(donation: Donation): number {
    const createdDate: Date = donation.createdTime instanceof Date
      ? donation.createdTime
      : new Date(donation.createdTime);

    return createdDate.getTime();
  }

  private removeOldLocalDonations() {
    let donationsOlderThan30Days: Array<{ donation: Donation, jwt: string }>;
    donationsOlderThan30Days = this.getDonationCouplets().filter(donationItem => {
      return (!donationItem.donation.createdTime || this.getCreatedTime(donationItem.donation) < ((new Date()).getTime() - 2592000000));
    });
    for (const oldDonationCouplet of donationsOlderThan30Days) {
      this.removeLocalDonation(oldDonationCouplet.donation);
    }
  }

  private getAuthHttpOptions(donation: Donation): { headers: HttpHeaders } {
    const donationDataItems = this.getDonationCouplets().filter(donationItem => donationItem.donation.donationId === donation.donationId);

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

  private getLocalDonationCouplet(donationId: string): { donation: Donation, jwt: string } {
    const donations = this.getDonationCouplets().filter(donationItem => {
      return (donationItem.donation.donationId === donationId);
    });

    if (donations.length === 0) {
      return undefined;
    }

    return donations[0];
  }

  private getDonationCouplets() {
    if (this.donationCouplets.length === 0) {
      this.donationCouplets = this.storage.get(this.storageKey) || [];
    }

    return this.donationCouplets;
  }
}
