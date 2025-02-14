import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {from, Observable} from 'rxjs';

import {DonationService} from './donation.service';
import {PaymentMethod} from '@stripe/stripe-js';

@Injectable(
  {providedIn: 'root'}
)
export class PaymentMethodsResolver {
  constructor(private donationService: DonationService) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<PaymentMethod[]> {
    return from(this.donationService.getPaymentMethods());
  }
}
