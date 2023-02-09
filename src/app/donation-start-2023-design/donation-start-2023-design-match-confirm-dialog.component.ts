import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { allChildComponentImports } from '../../allChildComponentImports';

@Component({
  standalone: true,
  selector: 'app-donation-start-2023-design-match-confirm-dialog',
  templateUrl: 'donation-start-2023-design-match-confirm-dialog.html',
  imports: [
    ...allChildComponentImports,
    MatButtonModule,
    MatDialogModule,
  ],
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
