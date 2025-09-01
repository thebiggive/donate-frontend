import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, InjectionToken, makeStateKey, PLATFORM_ID, TransferState, inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ConfirmationToken, PaymentIntent, PaymentMethod, SetupIntent } from '@stripe/stripe-js';

import { COUNTRY_CODE } from './country-code.token';
import { CompleteDonation, Donation, PaymentMethodType } from './donation.model';
import { DonationCreatedResponse } from './donation-created-response.model';
import { environment } from '../environments/environment';
import { Person } from './person.model';
import { MatomoTracker } from 'ngx-matomo-client';
import { map, switchMap } from 'rxjs/operators';
import { IdentityService, getPersonAuthHttpOptions } from './identity.service';
import { completeStatuses, DonationStatus, resumableStatuses } from './donation-status.type';
import { CookieService } from 'ngx-cookie-service';
import { Campaign } from './campaign.model';

export const TBG_DONATE_STORAGE = new InjectionToken<StorageService>('TBG_DONATE_STORAGE');

export const STRIPE_SESSION_SECRET_COOKIE_NAME = 'stripe-session-secret';

export type StripeCustomerSession = { stripeSessionSecret: string };

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private defaultCountryCode = inject(COUNTRY_CODE, { optional: true });
  private http = inject(HttpClient);
  private identityService = inject(IdentityService);
  private matomoTracker = inject(MatomoTracker);
  private platformId = inject(PLATFORM_ID);
  private sessionStorage = inject<StorageService>(SESSION_STORAGE);
  private cookieService = inject(CookieService);
  private storage = inject<StorageService>(TBG_DONATE_STORAGE);
  private state = inject(TransferState);

  private readonly apiPath = '/donations';
  private readonly storageKey = `${environment.donateUriPrefix}/v2`;

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

  /**
   * @return Country code as uppercase alpha-2 ISO code, e.g. 'GB', 'VA', 'US' etc
   */
  getDefaultCounty(): string {
    return this.defaultCountryCode || 'GB';
  }

  getDonation(donationId: string): Donation | undefined {
    const couplet = this.getLocalDonationCouplet(donationId);

    if (!couplet) {
      return undefined;
    }

    return couplet.donation;
  }

  isResumable(donation: Donation, paymentMethodType: PaymentMethodType): boolean {
    return (
      donation.status !== undefined &&
      (resumableStatuses as readonly DonationStatus[]).includes(donation.status) &&
      this.isPaymentElementMethod(donation.pspMethodType) === this.isPaymentElementMethod(paymentMethodType)
    );
  }

  /**
   * Get a recent eligible-for-resuming donation to this same campaign/project, if any exists. We look
   * for candidates based on local status initially but return an Observable resulting from a re-GET
   * so we include the latest server status. This is why this method only knows the donation is
   * 'probably' resumable.
   */
  getProbablyResumableDonation(
    projectId: string,
    paymentMethodType: PaymentMethodType,
  ): Observable<Donation | undefined> {
    this.removeOldLocalDonations();

    const existingDonations = this.getDonationCouplets().filter((donationItem) => {
      return (
        donationItem.donation.projectId === projectId && // Only bring back donations to the same project/CCampaign...
        this.getCreatedTime(donationItem.donation) > Date.now() - 1_500_000 && // ...from the past 25 minutes...
        this.isResumable(donationItem.donation, paymentMethodType) // ...with a reusable last-known status & method.
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
    this.saveDonation({ donation, jwt });
  }

  /**
   * Indicates whether a donation is considered successful and fully processed. This is not always 'final' - donations
   * can be refunded and exit the Collected status.
   */
  isComplete(donation: Donation): donation is CompleteDonation {
    return donation.status !== undefined && (completeStatuses as readonly DonationStatus[]).includes(donation.status);
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
    if (donation.homeAddress && Object.prototype.hasOwnProperty.call(donation.homeAddress, 'address')) {
      // should never happen given fix made now to AddressService.loadAddress but just in case:

      console.error('Donation.homeAddress is object, should be string');
      // @ts-expect-error 'Property address does not exist on type string'
      donation.homeAddress = donation.homeAddress.address;
    }

    return this.http.put<Donation>(
      `${environment.matchbotApiPrefix}${this.apiPath}/${donation.donationId}`,
      donation,
      this.getAuthHttpOptions(donation),
    );
  }

  async getPaymentMethods(
    { cacheBust }: { cacheBust?: boolean } = { cacheBust: false },
  ): Promise<{ adHocMethods: PaymentMethod[]; regularGivingPaymentMethod?: PaymentMethod }> {
    const { jwt, person } = await this.getLoggedInUser();

    const cacheBuster = cacheBust ? '?t=' + new Date().getTime() : '';

    const response = (await firstValueFrom(
      this.http.get(
        `${environment.matchbotApiPrefix}/people/${person.id}/payment_methods${cacheBuster}`,
        getPersonAuthHttpOptions(jwt),
      ),
    )) as { data: PaymentMethod[]; regularGivingPaymentMethod?: PaymentMethod };

    return {
      adHocMethods: response.data,
      regularGivingPaymentMethod: response.regularGivingPaymentMethod,
    };
  }

  private async getLoggedInUser() {
    const jwt = this.identityService.getJWT();
    const person = await firstValueFrom(this.identityService.getLoggedInPerson());

    if (!person) {
      throw new Error('logged in person required');
    }

    return { jwt, person };
  }

  create(donation: Donation, personId?: string, jwt?: string): Observable<DonationCreatedResponse> {
    const endpoint = personId
      ? `${environment.matchbotApiPrefix}/people/${personId}${this.apiPath}`
      : `${environment.matchbotApiPrefix}${this.apiPath}`;

    return this.http.post<DonationCreatedResponse>(endpoint, donation, getPersonAuthHttpOptions(jwt));
  }

  get(donation: Donation): Observable<Donation> {
    // Without use of the cacheBuster the browser seems to be caching the result and not sending
    // another get request to poll the donation status to show when we have collected payment.
    // Not sure why we should need it. Returns timestamp e.g. 1680260722
    const cacheBuster = Math.floor(new Date().getTime() / 1000);

    return this.http.get<Donation>(
      `${environment.matchbotApiPrefix}${this.apiPath}/${donation.donationId}?cb=${cacheBuster}`,
      this.getAuthHttpOptions(donation),
    );
  }

  public get stripeSessionSecret(): string | undefined {
    const secret = this.cookieService.get(STRIPE_SESSION_SECRET_COOKIE_NAME);
    if (secret == '') {
      return undefined;
    }

    return secret;
  }

  saveDonation({ donation, jwt, stripeSessionSecret }: DonationCreatedResponse) {
    // Salesforce doesn't add this until after the async persist so we need to set it
    // locally in order to later determine which donations are new and eligible for reuse.
    // Note that updates call this too so this must check for existing values and not
    // replace them with now.
    if (!donation.createdTime) {
      donation.createdTime = new Date().toISOString();
    }

    if (stripeSessionSecret) {
      const daysTilExpiry = 1;
      this.cookieService.set(STRIPE_SESSION_SECRET_COOKIE_NAME, stripeSessionSecret, daysTilExpiry, '/');
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
      donationCouplets.findIndex((donationItem) => donationItem.donation.donationId === donation.donationId),
      1,
    );

    this.sessionStorage.set(this.storageKey, donationCouplets);
  }

  /**
   * Removes donations that were set in local storage before we switched to using session storage.
   */
  removeOldLocalDonations() {
    this.storage.remove(this.storageKey);
  }

  /**
   * Safely get created date from a Donation, whether the local data has it as a Date (e.g. when set locally) or
   * a string (when just derived from an HTTP response), and return it as a JavaScript Unix epoch milliseconds value.
   */
  private getCreatedTime(donation: Donation): number {
    if (donation.createdTime) {
      return new Date(donation.createdTime).getTime();
    }

    return 0;
  }

  private getAuthHttpOptions(donation: Donation): { headers: HttpHeaders } {
    const donationDataItems = this.getDonationCouplets().filter(
      (donationItem) => donationItem.donation.donationId === donation.donationId,
    );

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

  private getLocalDonationCouplet(donationId: string): { donation: Donation; jwt: string } | undefined {
    const donations = this.getDonationCouplets().filter((donationItem) => {
      return donationItem.donation.donationId === donationId;
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
  private getDonationCouplets(): Array<{ donation: Donation; jwt: string }> {
    return this.sessionStorage.get(this.storageKey) ?? this.storage.get(this.storageKey) ?? [];
  }

  deleteStripePaymentMethod(person: Person, method: PaymentMethod, jwt: string) {
    const paymentMethodId: string = method.id;
    const personId = person.id;

    if (!personId) {
      throw new Error('Undefined person ID');
    }

    return this.http.delete<{ data: PaymentMethod[] }>(
      `${environment.matchbotApiPrefix}/people/${personId}/payment_methods/${paymentMethodId}`,
      getPersonAuthHttpOptions(jwt),
    );
  }

  updatePaymentMethod(
    person: Person,
    jwt: string,
    paymentMethodId: string,
    updatedMethodDetails: {
      countryCode: string;
      postalCode: string;
      expiry: { month: number; year: number };
    },
  ) {
    const url = `${environment.matchbotApiPrefix}/people/${person.id}/payment_methods/${paymentMethodId}/billing_details`;

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
            postal_code: updatedMethodDetails.postalCode,
          },
          email: person.email_address,
          name: `${person.first_name} ${person.last_name}`,
        },
      },
      { headers: getPersonAuthHttpOptions(jwt).headers },
    );
  }

  confirmCardPayment(
    donation: Donation,
    { confirmationToken }: { confirmationToken?: ConfirmationToken },
  ): Observable<{ paymentIntent: { status: PaymentIntent.Status; client_secret: string } }> {
    return this.http.post<{ paymentIntent: { status: PaymentIntent.Status; client_secret: string } }>(
      `${environment.matchbotApiPrefix}/donations/${donation.donationId}/confirm`,
      {
        stripeConfirmationTokenId: confirmationToken?.id,
        stripeConfirmationTokenFutureUsage: confirmationToken?.setup_future_usage,
      },
      this.getAuthHttpOptions(donation),
    );
  }

  getPastDonations(): Observable<CompleteDonation[]> {
    const jwt = this.identityService.getJWT();
    const person$ = this.identityService.getLoggedInPerson();

    return person$.pipe(
      switchMap((person) => {
        if (!person) {
          throw new Error('logged in person required');
        }

        return this.http
          .get<{
            donations: CompleteDonation[];
          }>(`${environment.matchbotApiPrefix}/people/${person.id}/donations`, getPersonAuthHttpOptions(jwt))
          .pipe(map((response) => response.donations));
      }),
    );
  }

  cancelDonationFundsToCampaign(campaignId: string): Observable<Donation[]> {
    const jwt = this.identityService.getJWT();
    const person$ = this.identityService.getLoggedInPerson();

    return person$.pipe(
      switchMap((person) => {
        if (!person) {
          throw new Error('logged in person required');
        }

        return this.http
          .request<{
            donations: Donation[];
          }>(
            'DELETE',
            `${environment.matchbotApiPrefix}/people/${person.id}/donations?campaignId=${campaignId}&paymentMethodType=customer_balance`,
            getPersonAuthHttpOptions(jwt),
          )
          .pipe(map((response) => response.donations));
      }),
    );
  }

  /**
   * @param campaign: Campaign that the donor is considering donating to. Optional, will instruct matchbot to fetch
   * fetch this campaign from SF in preparation for a donation or mandate.
   */
  async createCustomerSessionForRegularGiving({ campaign }: { campaign?: Campaign }): Promise<StripeCustomerSession> {
    const { jwt, person } = await this.getLoggedInUser();

    return firstValueFrom(
      this.http.post(
        `${environment.matchbotApiPrefix}/people/${person.id}/create-customer-session`,
        { campaignId: campaign?.id },
        getPersonAuthHttpOptions(jwt),
      ) as Observable<StripeCustomerSession>,
    );
  }

  async createSetupIntent(): Promise<SetupIntent> {
    const { jwt, person } = await this.getLoggedInUser();

    return (
      await firstValueFrom(
        this.http.post(
          `${environment.matchbotApiPrefix}/people/${person.id}/create-setup-intent`,
          {},
          getPersonAuthHttpOptions(jwt),
        ) as Observable<{ setupIntent: SetupIntent }>,
      )
    ).setupIntent;
  }

  async removeMatchingExpectation(donation: Donation) {
    await firstValueFrom(
      this.http.post<void>(
        `${environment.matchbotApiPrefix}${this.apiPath}/${donation.donationId}/remove-matching-expectation`,
        donation,
        this.getAuthHttpOptions(donation),
      ),
    );
  }

  private isPaymentElementMethod(pspMethodType: PaymentMethodType): boolean {
    switch (pspMethodType) {
      case 'card':
      case 'pay_by_bank':
      case 'apple_pay':
      case 'google_pay':
        return true;

      case 'customer_balance':
        return false;

      default:
        throw new Error('Unexpected payment method type: ' + pspMethodType);
    }
  }
}
