import { Component, Inject } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { allChildComponentImports } from '../../allChildComponentImports';
import { Donation } from '../donation.model';
import { ExactCurrencyPipe } from '../exact-currency.pipe';

@Component({
  standalone: true,
  selector: 'app-donation-start-offer-reuse-dialog',
  templateUrl: 'donation-start-offer-reuse-dialog.html',
  imports: [
    ...allChildComponentImports,
    ExactCurrencyPipe,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class DonationStartOfferReuseDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { donation: Donation }) { }
}
