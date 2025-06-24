import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DonationService } from './donation.service';
import { CompleteDonation } from './donation.model';

@Injectable({ providedIn: 'root' })
export class PastDonationsResolver implements Resolve<CompleteDonation[]> {
  private donationService = inject(DonationService);

  resolve(_route: ActivatedRouteSnapshot): Observable<CompleteDonation[]> {
    return this.donationService.getPastDonations();
  }
}
