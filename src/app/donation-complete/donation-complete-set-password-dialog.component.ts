import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Person } from '../person.model';

@Component({
  selector: 'app-donation-complete-set-password-dialog',
  templateUrl: 'donation-complete-set-password-dialog.html',
})
export class DonationCompleteSetPasswordDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      person: Person,
    },
    private dialogRef: MatDialogRef<DonationCompleteSetPasswordDialogComponent>,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: [null, [
        Validators.required,
        Validators.minLength(10),
      ]],
    });
  }

  set() {
    this.dialogRef.close({ password: this.form.value.password });
  }
}
