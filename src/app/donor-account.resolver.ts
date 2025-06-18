import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DonorAccountService } from './donor-account.service';
import { DonorAccount } from './donorAccount.model';

@Injectable({ providedIn: 'root' })
export class DonorAccountResolver implements Resolve<DonorAccount | null> {
  private donorAccountService = inject(DonorAccountService);

  resolve(_route: ActivatedRouteSnapshot): Observable<DonorAccount | null> {
    return this.donorAccountService.getLoggedInDonorAccount();
  }
}
