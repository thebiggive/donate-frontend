import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Mandate } from './mandate.model';
import { getPersonAuthHttpOptions, IdentityService } from './identity.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { Campaign } from './campaign.model';

/**
 * Details of a desired new regular giving mandate sent to Matchbot to create it. Deseralized on the matchbot side
 * to class MandateCreate: https://github.com/thebiggive/matchbot/blob/main/src/Application/HttpModels/MandateCreate.php
 */
export type StartMandateParams = {
  amountInPence: number;
  currency: 'GBP';
  dayOfMonth: number;
  campaignId: string;
  giftAid: boolean;

  /** @deprecated pass home instead */
  homeAddress: string | null;

  /** @deprecated pass home instead */
  homePostcode: string | null;

  /** Home address details used for Gift Aid claim. Should only be included if GA is selected. */
  home?: {
    addressLine1: string;
    postcode: string;
    isOutsideUK: boolean;
  };

  /** ISO-2 code for country. Must match that on the DonorAccount if the latter is non-null */
  billingCountry: string;

  /** Must be null or match postcode on the DonorAccount if the latter is non-null */
  billingPostcode: string | null;

  /** Should only be set if the donor previously had no payment
   * method selected on their account for regular-giving use, as the payment method is common to all regular giving
   * agreements for the account. If it needs to changed that will be handled at the account, rather than as part of
   * a mandate.
   */
  stripeConfirmationTokenId?: string;

  /** Whether the Donor wants to receive marketing emails from Big Give */
  tbgComms: boolean;

  /** Whether the Donor wants to receive marketing emails from the charity they donate to with this mandate */
  charityComms: boolean;

  /** Whether the Donor is happy to donate without having their donations matched */
  unmatched?: boolean;
};

type PersonAuthHttpOptions = { headers: HttpHeaders };
export type MandateCreateResponse = {
  mandate: Mandate;
  paymentIntent: undefined | { status: 'requires_action'; client_secret: string };
};

@Injectable({
  providedIn: 'root',
})
export class RegularGivingService {
  private http = inject(HttpClient);
  private identityService = inject(IdentityService);

  public startMandate(mandate: StartMandateParams): Observable<MandateCreateResponse> {
    return this.withLoggedInDonor((personAuthHttpOptions: PersonAuthHttpOptions) => {
      const IDAndJWT = this.identityService.getIdAndJWT()!;
      return this.http.post<unknown>(
        `${environment.matchbotApiPrefix}/people/${IDAndJWT.id}/regular-giving`,
        mandate,
        personAuthHttpOptions,
      ) as Observable<MandateCreateResponse>;
    });
  }

  /**
   * Returns an array of regular giving mandates for the donor to view. Includes active mandates and any that
   * would have been active in the past. Excludes pending and those that were cancelled directly from pending
   * state.
   */
  public getMyMandates() {
    return this.withLoggedInDonor((personAuthHttpOptions: PersonAuthHttpOptions) => {
      return this.http
        .get<{
          mandates: Mandate[];
        }>(`${environment.matchbotApiPrefix}/regular-giving/my-donation-mandates`, personAuthHttpOptions)
        .pipe(map((response) => response.mandates));
    });
  }

  public getActiveMandate(mandateId: string) {
    return this.withLoggedInDonor((personAuthHttpOptions: PersonAuthHttpOptions) => {
      return this.http
        .get<{
          mandate: Mandate;
        }>(`${environment.matchbotApiPrefix}/regular-giving/my-donation-mandates/${mandateId}`, personAuthHttpOptions)
        .pipe(map((response) => response.mandate));
    });
  }

  public cancel(mandate: Mandate, { cancellationReason }: { cancellationReason: string }): Observable<unknown> {
    return this.withLoggedInDonor((personAuthHttpOptions: PersonAuthHttpOptions) => {
      return this.http.post(
        `${environment.matchbotApiPrefix}/regular-giving/my-donation-mandates/${mandate.id}/cancel`,
        {
          cancellationReason: cancellationReason,
          mandateUUID: mandate.id,
        },
        personAuthHttpOptions,
      );
    });
  }

  private withLoggedInDonor<T extends (personAuthHttpOptions: PersonAuthHttpOptions) => Observable<unknown>>(
    callable: T,
  ): ReturnType<T> {
    const jwt = this.identityService.getJWT();
    const person$ = this.identityService.getLoggedInPerson();
    const personAuthHttpOptions = getPersonAuthHttpOptions(jwt);

    // @ts-expect-error currently getting `Type Observable<unknown> is not assignable to type ReturnType<T>` .
    // Maybe ok to leave for now.
    return person$.pipe(
      switchMap((person) => {
        if (!person) {
          throw new Error('logged in person required');
        }

        return callable(personAuthHttpOptions);
      }),
    );
  }

  activeMandate(campaign: Campaign): Observable<Mandate[]> {
    // consider optimising by filtering in the backend database. But performance impact of filtering here should be
    // small, especially during the pilot when donors are unlikely to have many mandates each.
    return this.getMyMandates().pipe(
      map((mandates) =>
        mandates.filter((mandate: Mandate) => {
          return mandate.status === 'active' && mandate.campaignId === campaign.id;
        }),
      ),
    );
  }

  public setRegularGivingPaymentMethod(paymentMethodId: string): Promise<unknown> {
    return firstValueFrom(
      this.withLoggedInDonor((personAuthHttpOptions: PersonAuthHttpOptions) => {
        const IDAndJWT = this.identityService.getIdAndJWT()!;
        return this.http.put<unknown>(
          `${environment.matchbotApiPrefix}/people/${IDAndJWT.id}/regular-giving/payment-method`,
          { paymentMethodId },
          personAuthHttpOptions,
        );
      }),
    );
  }

  removeCard(): Promise<unknown> {
    return firstValueFrom(
      this.withLoggedInDonor((personAuthHttpOptions: PersonAuthHttpOptions) => {
        const IDAndJWT = this.identityService.getIdAndJWT()!;
        return this.http.delete<unknown>(
          `${environment.matchbotApiPrefix}/people/${IDAndJWT.id}/regular-giving/payment-method`,
          personAuthHttpOptions,
        );
      }),
    );
  }
}
