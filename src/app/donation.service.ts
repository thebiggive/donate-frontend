import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { StorageService } from 'ngx-webstorage-service';
import { Observable, of } from 'rxjs';

import { AnalyticsService } from './analytics.service';
import { Donation } from './donation.model';
import { DonationCreatedResponse } from './donation-created-response.model';
import { environment } from '../environments/environment';

export const TBG_DONATE_STORAGE = new InjectionToken<StorageService>('TBG_DONATE_STORAGE');

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly apiPath = '/donations';
  private readonly completeStatuses = ['Collected', 'Paid'];
  private readonly resumableStatuses = ['Pending', 'Reserved'];
  private readonly storageKey = `${environment.donateUriPrefix}/v2`; // Key is per-domain/env
  private readonly uxConfigKey = `${environment.donateUriPrefix}/ux/v1`;

  constructor(
    private analyticsService: AnalyticsService,
    private http: HttpClient,
    @Inject(TBG_DONATE_STORAGE) private storage: StorageService,
  ) {}

  getDonation(donationId: string): Donation | undefined {
    const couplet = this.getLocalDonationCouplet(donationId);

    if (!couplet) {
      return undefined;
    }

    return couplet.donation;
  }

  isResumable(donation: Donation): boolean {
    return (donation.status !== undefined && this.resumableStatuses.includes(donation.status));
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
        this.getCreatedTime(donationItem.donation) > (Date.now() - 600000) && // ...from the past 10 minutes...
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
   * Supports variant tests for now. Uses local storage to give each donor
   * a consistent experience while they are on the same device.
   */
  getSuggestedAmounts(): number[] {
    const stateKey = this.uxConfigKey;
    const existingConfig = this.storage.get(stateKey);

    if (existingConfig && existingConfig.suggestedAmounts) {
      // For now we remember a previously configured set of suggested
      // amounts indefinitely for a given donor.
      return existingConfig.suggestedAmounts;
    }

    let suggestedAmounts: number[] = [];

    if (environment.suggestedAmounts.length > 0) {
      // Approach inspired by https://blobfolio.com/2019/10/randomizing-weighted-choices-in-javascript/
      let thresholdCounter = 0;
      for (const suggestedAmount of environment.suggestedAmounts) {
        thresholdCounter += suggestedAmount.weight;
      }
      const threshold = Math.floor(Math.random() * thresholdCounter);

      thresholdCounter = 0;
      for (const suggestedAmount of environment.suggestedAmounts) {
        thresholdCounter += suggestedAmount.weight;

        if (thresholdCounter > threshold) {
          suggestedAmounts = suggestedAmount.values;
          break;
        }
      }
    }

    this.storage.set(stateKey, { suggestedAmounts });

    return suggestedAmounts;
  }

  /**
   * Update a local copy of a Donation that we already expect to have saved, leaving its
   * JWT in tact so that e.g. its details can still be loaded on the thank you page.
   */
  updateLocalDonation(donation: Donation) {
    if (!donation.donationId) {
      return;
    }

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
    return (donation.status !== undefined && this.completeStatuses.includes(donation.status));
  }

  /**
   * Cancel donation in Salesforce to free up match funds straight away.
   * This is a special case PUT: this method is just a convenience wrapper
   * to set the new status without other changes.
   *
   * Subscribers should `removeLocalDonation()` on success.
   */
  cancel(donation: Donation): Observable<any> {
    donation.status = 'Cancelled';

    return this.update(donation);
  }

  update(donation: Donation): Observable<any> {
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
    // Salesforce doesn't add this until after the async persist so we need to set it
    // locally in order to later determine which donations are new and eligible for reuse.
    // Note that updates call this too so this must check for existing values and not
    // replace them with now.
    if (!donation.createdTime) {
      donation.createdTime = (new Date()).toISOString();
    }

    const donationCouplets = this.getDonationCouplets();
    donationCouplets.push({ donation, jwt });
    this.storage.set(this.storageKey, donationCouplets);
  }

  removeLocalDonation(donation?: Donation) {
    if (!donation) {
      return;
    }

    const donationCouplets = this.getDonationCouplets();
    donationCouplets.splice(
      donationCouplets.findIndex(donationItem => donationItem.donation.donationId === donation.donationId),
      1,
    );
    this.storage.set(this.storageKey, donationCouplets);
  }

  removeOldLocalDonations() {
    let donationsOlderThan30Days: Array<{ donation: Donation, jwt: string }>;
    donationsOlderThan30Days = this.getDonationCouplets().filter(donationItem => {
      return (!donationItem.donation.createdTime || this.getCreatedTime(donationItem.donation) < (Date.now() - 2592000000));
    });
    for (const oldDonationCouplet of donationsOlderThan30Days) {
      this.removeLocalDonation(oldDonationCouplet.donation);
    }
  }

  /**
   * Safely get created date from a Donation, whether the local data has it as a Date (e.g. when set locally) or
   * a string (when just derived from an HTTP response), and return it as a JavaScript Unix epoch milliseconds value.
   */
  private getCreatedTime(donation: Donation): number {
    if (donation.createdTime) {
      return (new Date(donation.createdTime)).getTime();
    }

    return 0;
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

  private getLocalDonationCouplet(donationId: string): { donation: Donation, jwt: string } | undefined {
    const donations = this.getDonationCouplets().filter(donationItem => {
      return (donationItem.donation.donationId === donationId);
    });

    if (donations.length === 0) {
      return undefined;
    }

    return donations[0];
  }

  /**
   * For the purpose of this class, each `donationCouplet` is a pairing of a donation and its corresponding
   * unique JWT. This token grants the donor who originally created a donation permission to get its current
   * status & additional data, and to cancel it if it's Pending or Reserved.
   */
  private getDonationCouplets(): Array<{ donation: Donation, jwt: string }> {
    return this.storage.get(this.storageKey) || [];
  }
}
