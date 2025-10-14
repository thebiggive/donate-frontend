import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PopupStandaloneComponent } from '../popup-standalone/popup-standalone.component';

@Component({
  selector: 'app-donation-start-match-confirm-dialog',
  templateUrl: 'donation-start-match-confirm-dialog.html',
  imports: [MatButtonModule, MatDialogModule, PopupStandaloneComponent],
})
export class DonationStartMatchConfirmDialogComponent {
  data = inject<{
    cancelCopy: string;
    proceedCopy: string;
    status: string; // Rendered as trusted HTML
    statusDetail: string; // Rendered as trusted HTML
    title: string;
    surplusDonationInfo: string;
  }>(MAT_DIALOG_DATA);
}
