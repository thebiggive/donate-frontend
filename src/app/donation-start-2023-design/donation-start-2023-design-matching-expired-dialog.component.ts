import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { allChildComponentImports } from '../../allChildComponentImports';

@Component({
  standalone: true,
  selector: 'app-donation-start-2023-design-matching-expired-dialog',
  templateUrl: 'donation-start-2023-design-matching-expired-dialog.html',
  imports: [
    ...allChildComponentImports,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class DonationStartMatchingExpiredDialogComponent {
  constructor() {}
}
