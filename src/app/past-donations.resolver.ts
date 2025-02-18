import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';

import {DonationService} from './donation.service';
import {CompleteDonation} from './donation.model';

@Injectable(
  {providedIn: 'root'}
)
export class PastDonationsResolver implements Resolve<CompleteDonation[]>{
  constructor(private donationService: DonationService) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<CompleteDonation[]> {
    return this.donationService.getPastDonations();
  }
}
