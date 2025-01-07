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
