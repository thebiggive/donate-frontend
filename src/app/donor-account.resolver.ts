import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import {DonorAccountService} from './donor-account.service';
import {DonorAccount} from './donorAccount.model';

@Injectable(
  {providedIn: 'root'}
)
export class DonorAccountResolver {
  constructor(private donorAccountService: DonorAccountService) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<DonorAccount | null> {
    return this.donorAccountService.getLoggedInDonorAccount();
  }
}
