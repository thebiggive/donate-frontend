import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "../environments/environment";
import {Person} from "./person.model";
import {IdentityService} from "./identity.service";

@Injectable({
  providedIn: 'root',
})
export class DonorAccountService {
  constructor(
    private http: HttpClient,
    private identityService: IdentityService,
  ) {
  }

  createAccount(donor: Person): Observable<unknown> {
    const jwt = this.identityService.getJWT();
    if (!jwt) {
      throw new Error("Missing JWT, can't create donor account");
    }

    return this.http.post(
      `${environment.donationsApiPrefix}/${donor.id}/donor-account`,
      {
        emailAddress: donor.email_address,
        donorName: {
          firstName: donor.first_name,
          lastName: donor.last_name,
        }
      },
      {headers: new HttpHeaders({'X-Tbg-Auth': jwt})}
    );
  }
}
