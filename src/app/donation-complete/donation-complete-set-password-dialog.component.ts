import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Person } from '../person.model';

@Component({
  selector: 'app-donation-complete-set-password-dialog',
  templateUrl: 'donation-complete-set-password-dialog.html',
})
export class DonationCompleteSetPasswordDialogComponent {
  password: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    person: Person,
  }) {}
}
