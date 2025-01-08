import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Mandate} from "./mandate.model";
import {getPersonAuthHttpOptions, IdentityService} from "./identity.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";


type StartMandateParams = {
  amountInPence: number,
  currency: 'GBP',
  dayOfMonth: number,
  campaignId: string,
  giftAid: boolean,
  /** ISO-2 code for country. Must match that on the DonorAccount if the latter is non-null */
  billingCountry: string,

  /** Must match postcode on the DonorAccount if the latter is non-null */
  billingPostcode: string,

  /** Should only be set if the donor previously had no payment
   * method selected on their account for regular-giving use, as the payment method is common to all regular giving
   * agreements for the account. If it needs to changed that will be handled at the account, rather than as part of
   * a mandate.
   */
  stripeConfirmationTokenId?: string,
};

@Injectable({
  providedIn: 'root',
})
export class RegularGivingService {
  constructor(
    private http: HttpClient,
    private identityService: IdentityService,
  ) {}

  startMandate(mandate: StartMandateParams): Observable<Mandate> {
    const IDAndJWT = this.identityService.getIdAndJWT();
    if (!IDAndJWT) {
      throw new Error("Missing ID and JWT, can't create mandate");
    }

    return this.http.post<unknown>(
      `${environment.donationsApiPrefix}/people/${IDAndJWT.id}/regular-giving`,
      mandate,
      getPersonAuthHttpOptions(IDAndJWT.jwt),
    ) as Observable<Mandate>;
  }
}
