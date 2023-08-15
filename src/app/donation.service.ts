import {isPlatformServer} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable, InjectionToken, makeStateKey, Optional, PLATFORM_ID, TransferState,} from '@angular/core';
import {SESSION_STORAGE, StorageService} from 'ngx-webstorage-service';
import {Observable, of} from 'rxjs';
import {PaymentMethod} from '@stripe/stripe-js';

import {COUNTRY_CODE} from './country-code.token';
import {Donation} from './donation.model';
import {DonationCreatedResponse} from './donation-created-response.model';
import {environment} from '../environments/environment';
import {Person} from "./person.model";
import {MatomoTracker} from 'ngx-matomo';

export const TBG_DONATE_STORAGE = new InjectionToken<StorageService>('TBG_DONATE_STORAGE');

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly apiPath = '/donations';
  private readonly completeStatuses = ['Collected', 'Paid'];
  private readonly resumableStatuses = ['Pending', 'Reserved'];
  private readonly storageKey = `${environment.donateGlobalUriPrefix}/v2`; // Key is per-domain/env

  constructor(
    @Optional() @Inject(COUNTRY_CODE) private defaultCountryCode: string,
    private http: HttpClient,
    private matomoTracker: MatomoTracker,
    @Inject(PLATFORM_ID) private platformId: Object,

    @Inject(SESSION_STORAGE) private sessionStorage: StorageService,

    /**
     * @todo - after a version of this that includes the `sessionStorage` property above has been deployed for
     * one day remove this - it's only here to allow us to retrieve donation info stored just before that change.
     */
    @Inject(TBG_DONATE_STORAGE) private storage: StorageService,

    private state: TransferState,
  ) {}

  deriveDefaultCountry() {
    // Only server-rendered, CloudFront-fronted requests set this token. In other
    // cases we should fall back to UK as the default country.
    const defaultCountryKey = makeStateKey<string>(`default-country-code`);
    if (isPlatformServer(this.platformId)) {
      if (!this.defaultCountryCode) {
        this.defaultCountryCode = 'GB';
      }
      this.state.set(defaultCountryKey, this.defaultCountryCode);
    } else {
      this.defaultCountryCode = this.state.get(defaultCountryKey, 'GB');
    }
  }

  getDefaultCounty(): string {
    return this.defaultCountryCode;
  }

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
    return this.get(existingDonations[0]!.donation);
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
  cancel(donation: Donation): Observable<Donation> {
    donation.status = 'Cancelled';

    return this.update(donation);
  }

  finaliseCashBalancePurchase(donation: Donation): Observable<Donation> {
    donation.autoConfirmFromCashBalance = true;
    donation.tipAmount = 0; // Make extra sure no background magic can take an invisible tip!

    return this.update(donation);
  }

  update(donation: Donation): Observable<Donation> {
    return this.http.put<Donation>(
      `${environment.donationsApiPrefix}${this.apiPath}/${donation.donationId}`,
      donation,
      this.getAuthHttpOptions(donation),
    );
  }

  /**
   * Sets card metadata to ensure the correct fees are applied. Also updates the local copy
   * of the donation as a side effect.
   */
  updatePaymentDetails(donation: Donation, cardBrand = 'N/A', cardCountry = 'N/A'): Observable<Donation> {
    if (donation.cardBrand === cardBrand && donation.cardCountry === cardCountry) {
      return of(donation); // No-op. No fee change or new info -> don't call the server.
    }

    donation.cardBrand = cardBrand;
    donation.cardCountry = cardCountry;

    const observable = this.update(donation);

    observable.subscribe(updatedDonation => {
      this.updateLocalDonation(updatedDonation);
    });

    return observable;
  }

  getPaymentMethods(personId?: string, jwt?: string): Observable<{ data: PaymentMethod[] }> {
    return this.http.get<{ data: PaymentMethod[] }>(
      `${environment.donationsApiPrefix}/people/${personId}/payment_methods`,
      this.getPersonAuthHttpOptions(jwt),
    );
  }

  create(donation: Donation, personId?: string, jwt?: string): Observable<DonationCreatedResponse> {
    let endpoint = personId
      ? `${environment.donationsApiPrefix}/people/${personId}${this.apiPath}`
      : `${environment.donationsApiPrefix}${this.apiPath}`;

    return this.http.post<DonationCreatedResponse>(
      endpoint,
      donation,
      this.getPersonAuthHttpOptions(jwt),
    );
  }

  get(donation: Donation): Observable<Donation> {
    // Without use of the cacheBuster the browser seems to be caching the result and not sending
    // another get request to poll the donation status to show when we have collected payment.
    // Not sure why we should need it. Returns timestamp e.g. 1680260722
    const cacheBuster = Math.floor(new Date().getTime() / 1000);

    return this.http.get<Donation>(
      `${environment.donationsApiPrefix}${this.apiPath}/${donation.donationId}?cb=${cacheBuster}`,
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

    this.sessionStorage.set(this.storageKey, donationCouplets);
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

    this.sessionStorage.set(this.storageKey, donationCouplets);
  }

  removeOldLocalDonations() {
    const donationsOlderThan30Days: Array<{ donation: Donation, jwt: string }> = this.getDonationCouplets().filter(donationItem => {
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
      this.matomoTracker.trackEvent(
        'donate_error',
        'auth_jwt_error',
        `Not authorised to work with donation ${donation.donationId} to campaign ${donation.projectId}`,
      );

      return { headers: new HttpHeaders({}) };
    }

    return {
      headers: new HttpHeaders({
        'X-Tbg-Auth': donationDataItems[0]!.jwt,
      }),
    };
  }

  private getPersonAuthHttpOptions(jwt?: string): { headers: HttpHeaders } {
    if (!jwt) {
      return { headers: new HttpHeaders({}) };
    }

    return {
      headers: new HttpHeaders({
        'X-Tbg-Auth': jwt,
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
    return this.sessionStorage.get(this.storageKey) ?? this.storage.get(this.storageKey) ?? [];
  }

  deleteStripePaymentMethod(person: Person, method: PaymentMethod, jwt: string) {
    const paymentMethodId: string = method.id;
    const personId = person.id;

    if (! personId) {
      throw new Error('Undefined person ID');
    }

    return this.http.delete<{ data: PaymentMethod[] }>(
      `${environment.donationsApiPrefix}/people/${personId}/payment_methods/${paymentMethodId}`,
      this.getPersonAuthHttpOptions(jwt),
    );
  }
  updatePaymentMethod(
    person: Person,
    jwt: string,
    paymentMethodId: string,
    updatedMethodDetails: {
      countryCode: string;
      postalCode: string;
      expiry: {month: number; year: number}
    }) {

    const url = `${environment.donationsApiPrefix}/people/${person.id}/payment_methods/${paymentMethodId}/billing_details`;

    return this.http.put<{ data: PaymentMethod[] }>(
      url,
      {
        card: {
          exp_month: updatedMethodDetails.expiry.month,
          exp_year: updatedMethodDetails.expiry.year,
        },
        billing_details: {
          address: {
          country: updatedMethodDetails.countryCode,
          postal_code: updatedMethodDetails.postalCode
        }}
      },
      {headers: this.getPersonAuthHttpOptions(jwt).headers}
    );
  }
}
