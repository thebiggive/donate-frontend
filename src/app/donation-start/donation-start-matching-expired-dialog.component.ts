import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { allChildComponentImports } from '../../allChildComponentImports';

@Component({
  standalone: true,
  selector: 'app-donation-start-matching-expired-dialog',
  templateUrl: 'donation-start-matching-expired-dialog.html',
  imports: [
    ...allChildComponentImports,
    MatDialogModule,
  ],
})
export class DonationStartMatchingExpiredDialogComponent {
  constructor() {}
}
