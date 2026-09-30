import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { PopupStandaloneComponent } from '../popup-standalone/popup-standalone.component';

@Component({
  selector: 'app-donation-start-matching-expired-dialog',
  templateUrl: 'donation-start-matching-expired-dialog.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatDialogModule, PopupStandaloneComponent],
})
export class DonationStartMatchingExpiredDialogComponent {
  constructor() {}
}
