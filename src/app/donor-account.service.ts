import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IdentityService } from './identity.service';
import { DonorAccount } from './donorAccount.model';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DonorAccountService {
  constructor(
    private http: HttpClient,
    private identityService: IdentityService,
  ) {}

  /**
   * Returns the DonorAccount as held in Matchbot for the logged-in user. Currently needed for building the regular
   * giving signup form, likely to be used in future on the "My Account" page etc.
   */
  getLoggedInDonorAccount(): Observable<null | DonorAccount> {
    const jwt = this.identityService.getJWT();
    if (!jwt) {
      throw new Error("Missing JWT, can't fetch donor account");
    }

    const identityPerson = this.identityService.getLoggedInPerson();

    return identityPerson.pipe(
      switchMap((identityPerson) => {
        if (!identityPerson) {
          return of(null);
        }

        return this.http.get(`${environment.matchbotApiPrefix}/people/${identityPerson.id}/donor-account`, {
          headers: new HttpHeaders({ 'X-Tbg-Auth': jwt }),
        }) as Observable<DonorAccount>;
      }),
    );
  }
}
