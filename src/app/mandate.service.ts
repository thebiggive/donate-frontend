import {Injectable} from "@angular/core";
import {map, switchMap} from "rxjs/operators";
import {Donation} from "./donation.model";
import {environment} from "../environments/environment";
import {IdentityService} from "./identity.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Mandate} from "./mandate.model";

@Injectable({
  providedIn: 'root',
})
export class MandateService {
  constructor(
    private http: HttpClient,
    private identityService: IdentityService,
  ) {
  }

  /**
   * Copied from Donation Service - refactor if possible before merging
   */
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

  getActiveMandates() {
    const jwt = this.identityService.getJWT();
    const person$ = this.identityService.getLoggedInPerson();

    return person$.pipe(switchMap((person) => {
      if (! person) {
        throw new Error("logged in person required");
      }

      return this.http.get<{ mandates: Mandate[] }>(
        `${environment.donationsApiPrefix}/regular-giving/my-donation-mandates`,
        this.getPersonAuthHttpOptions(jwt),
      ).pipe(map((response) => response.mandates));
    }));
  }
}
