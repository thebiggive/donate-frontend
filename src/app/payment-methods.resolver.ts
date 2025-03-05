import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {from, Observable} from 'rxjs';

import {DonationService} from './donation.service';
import {PaymentMethod} from '@stripe/stripe-js';

@Injectable(
  {providedIn: 'root'}
)
export class PaymentMethodsResolver implements Resolve<{adHocMethods: PaymentMethod[], regularGivingPaymentMethod?: PaymentMethod}> {
  constructor(private donationService: DonationService) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<{adHocMethods: PaymentMethod[], regularGivingPaymentMethod?: PaymentMethod}>  {
    return from(this.donationService.getPaymentMethods());
  }
}
