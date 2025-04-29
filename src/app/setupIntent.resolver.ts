import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {DonationService} from './donation.service';
import {SetupIntent} from '@stripe/stripe-js';

@Injectable(
  {providedIn: 'root'}
)
export class setupIntentResolver implements Resolve<SetupIntent> {
  constructor(private donationService: DonationService) {}

  async resolve(_route: ActivatedRouteSnapshot): Promise<SetupIntent>  {
    return this.donationService.createSetupIntent();
  }
}
