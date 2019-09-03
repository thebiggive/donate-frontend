import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';

import { Donation } from './donation.model';
import { DonationCreatedResponse } from './donation-created-response.model';
import { DonationStartComponent } from './donation-start/donation-start.component';
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
    private http: HttpClient,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) {
    this.donationCouplets = this.storage.get(this.storageKey) || [];
  }

  checkForExistingDonations(projectId: string, donationStartComponent: DonationStartComponent): void {
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
      return; // No relevant donations to offer to resume.
    }

    // We have at least one existing donation that may be a candidate to re-try.
    // We'll take an arbitrary 'first' matching donation since presenting multiple to the donor would be too confusing.
    // But we first need to check with the server that it's still in a Pending or Reserved status ready to try again -
    // and check any remaining local candidates if not.
    let foundReusableDonation = false;
    for (const existingDonation of existingDonations) {
      if (foundReusableDonation) {
        break;
      }

      this.get(existingDonation.donation)
        .subscribe((donation: Donation) => {
          if (!foundReusableDonation && this.resumableStatuses.includes(donation.status)) {
            foundReusableDonation = true;
            donationStartComponent.offerExistingDonation(donation);
          }
        });
    }
  }

  cancel(donation: Donation): Observable<any> {
    donation.status = 'Cancelled';

    // TODO we should immediately remove the local copy from this.donationCouplets when doing this

    return this.http.put<any>(
      `${environment.apiUriPrefix}${this.apiPath}/${donation.donationId}`,
      donation,
      this.getAuthHttpOptions(donation),
    );
  }

  create(donation: Donation): Observable<DonationCreatedResponse> {
    return this.http.post<DonationCreatedResponse>(
      `${environment.apiUriPrefix}${this.apiPath}`,
      donation,
    );
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

  private getAuthHttpOptions(donation: Donation): { headers: HttpHeaders } {
    const donationDataItems = this.donationCouplets.filter(donationItem => donationItem.donation.donationId === donation.donationId);

    if (donationDataItems.length !== 1) {
      // TODO log this, and handle it more elegantly if we can find any normal cases where users could encounter it.
      throw new Error('Not authorised to work with that donation');
    }

    return {
      headers: new HttpHeaders({
        'X-Tbg-Auth': donationDataItems[0].jwt,
      }),
    };
  }
}
