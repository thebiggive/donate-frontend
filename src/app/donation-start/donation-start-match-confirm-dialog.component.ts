import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { allChildComponentImports } from '../../allChildComponentImports';
import {PopupStandaloneComponent} from "../popup-standalone/popup-standalone.component";

@Component({
    selector: 'app-donation-start-match-confirm-dialog',
    templateUrl: 'donation-start-match-confirm-dialog.html',
    imports: [
        ...allChildComponentImports,
        MatButtonModule,
        MatDialogModule,
        PopupStandaloneComponent,
    ]
})
export class DonationStartMatchConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    cancelCopy: string,
    status: string,       // Rendered as trusted HTML
    statusDetail: string, // Rendered as trusted HTML
    title: string,
    surplusDonationInfo: string,
  }) {}
}
