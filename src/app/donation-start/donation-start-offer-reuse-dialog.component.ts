import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Donation } from '../donation.model';
import { ExactCurrencyPipe } from '../exact-currency.pipe';

@Component({
  standalone: true,
  selector: 'app-donation-start-offer-reuse-dialog',
  templateUrl: 'donation-start-offer-reuse-dialog.html',
  imports: [
    ExactCurrencyPipe,
    MatDialogModule,
  ],
})
export class DonationStartOfferReuseDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { donation: Donation }) { }
}
