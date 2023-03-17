import { Component, Inject } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { allChildComponentImports } from '../../allChildComponentImports';

@Component({
  standalone: true,
  selector: 'app-donation-start-match-confirm-dialog',
  templateUrl: 'donation-start-match-confirm-dialog.html',
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
