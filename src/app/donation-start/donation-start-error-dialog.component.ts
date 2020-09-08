import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-donation-start-error-dialog',
  templateUrl: 'donation-start-error-dialog.html',
})
export class DonationStartErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { pspError: string }) { }
}
