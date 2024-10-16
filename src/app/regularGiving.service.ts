import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Mandate} from "./mandate.model";
import {getPersonAuthHttpOptions, IdentityService} from "./identity.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";


@Injectable({
  providedIn: 'root',
})
export class RegularGivingService {
  constructor(
    private http: HttpClient,
    private identityService: IdentityService,
  ) {}

  startMandate(mandate: { amountInPence: number, currency: 'GBP', dayOfMonth: number, campaignId: string, giftAid: boolean }): Observable<Mandate> {
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
