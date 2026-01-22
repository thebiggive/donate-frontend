import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IdentityService } from './identity.service';
import { DonorAccount } from './donorAccount.model';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DonorAccountService {
  private http = inject(HttpClient);
  private identityService = inject(IdentityService);

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

  async withdrawAllFunds() {
    const jwt = this.identityService.getJWT();
    if (!jwt) {
      throw new Error("Missing JWT, can't withdraw funds");
    }

    const person = await firstValueFrom(this.identityService.getLoggedInPerson());
    if (!person) {
      throw new Error('No logged in person, cannot withdraw funds');
    }

    await firstValueFrom(
      this.http.post<void>(`${environment.matchbotApiPrefix}/people/${person.id}/donor-account/withdraw-funds`, '', {
        headers: new HttpHeaders({ 'X-Tbg-Auth': jwt }),
      }),
    );
  }
}
