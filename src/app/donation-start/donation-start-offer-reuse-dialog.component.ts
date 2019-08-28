import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Donation } from '../donation.model';

@Component({
  selector: 'app-donation-start-offer-reuse-dialog',
  templateUrl: 'donation-start-offer-reuse-dialog.html',
})
export class DonationStartOfferReuseDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { donation: Donation }) { }
}
