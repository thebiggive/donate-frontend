import {Injectable} from "@angular/core";
import {map, switchMap} from "rxjs/operators";
import {environment} from "../environments/environment";
import {IdentityService, getPersonAuthHttpOptions } from "./identity.service";
import { HttpClient } from "@angular/common/http";
import {Mandate} from "./mandate.model";
import {Campaign} from "./campaign.model";

@Injectable({
  providedIn: 'root',
})
export class MandateService {
  constructor(
    private http: HttpClient,
    private identityService: IdentityService,
  ) {
  }

  getActiveMandates() {
    const jwt = this.identityService.getJWT();
    const person$ = this.identityService.getLoggedInPerson();

    return person$.pipe(switchMap((person) => {
      if (! person) {
        throw new Error("logged in person required");
      }

      return this.http.get<{ mandates: Mandate[] }>(
        `${environment.donationsApiPrefix}/regular-giving/my-donation-mandates`,
        getPersonAuthHttpOptions(jwt),
      ).pipe(map((response) => response.mandates));
    }));
  }

  getActiveMandate(regularGivingCampaignId: Campaign) {
    const jwt = this.identityService.getJWT();
    const person$ = this.identityService.getLoggedInPerson();

    return person$.pipe(switchMap((person) => {
      if (! person) {
        throw new Error("logged in person required");
      }

      return this.http.get<{ mandate: Mandate }>(
        `${environment.donationsApiPrefix}/regular-giving/my-donation-mandate/${regularGivingCampaignId}`,
        getPersonAuthHttpOptions(jwt),
      ).pipe(map((response) => response.mandate));
    }));
  }
}
