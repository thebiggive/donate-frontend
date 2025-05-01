import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { allChildComponentImports } from '../../allChildComponentImports';
import { PopupStandaloneComponent } from '../popup-standalone/popup-standalone.component';

@Component({
  selector: 'app-donation-start-matching-expired-dialog',
  templateUrl: 'donation-start-matching-expired-dialog.html',
  imports: [...allChildComponentImports, MatButtonModule, MatDialogModule, PopupStandaloneComponent],
})
export class DonationStartMatchingExpiredDialogComponent {
  constructor() {}
}
