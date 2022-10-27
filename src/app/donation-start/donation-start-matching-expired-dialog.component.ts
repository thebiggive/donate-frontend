import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-donation-start-matching-expired-dialog',
  templateUrl: 'donation-start-matching-expired-dialog.html',
  imports: [
    MatDialogModule,
  ],
})
export class DonationStartMatchingExpiredDialogComponent {
  constructor() {}
}
