import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { DonationService } from './donation.service';
import { SetupIntent } from '@stripe/stripe-js';

@Injectable({ providedIn: 'root' })
export class setupIntentResolver implements Resolve<SetupIntent> {
  private donationService = inject(DonationService);

  async resolve(_route: ActivatedRouteSnapshot): Promise<SetupIntent> {
    return this.donationService.createSetupIntent();
  }
}
