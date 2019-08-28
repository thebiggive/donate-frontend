import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-donation-start-match-confirm-dialog',
  templateUrl: 'donation-start-match-confirm-dialog.html',
})
export class DonationStartMatchConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { cancelCopy: string, status: string }) { }
}
