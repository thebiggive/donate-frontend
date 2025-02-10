import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { allChildComponentImports } from '../../allChildComponentImports';
import { Donation } from '../donation.model';
import { ExactCurrencyPipe } from '../exact-currency.pipe';
import {PopupStandaloneComponent} from "../popup-standalone/popup-standalone.component";

@Component({
    selector: 'app-donation-start-offer-reuse-dialog',
    templateUrl: 'donation-start-offer-reuse-dialog.html',
    imports: [
        ...allChildComponentImports,
        ExactCurrencyPipe,
        MatButtonModule,
        MatDialogModule,
        PopupStandaloneComponent,
    ]
})
export class DonationStartOfferReuseDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { donation: Donation }) { }
}
