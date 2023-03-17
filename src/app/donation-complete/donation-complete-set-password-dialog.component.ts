import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { minPasswordLength } from 'src/environments/common';

import { allChildComponentImports } from '../../allChildComponentImports';
import { Person } from '../person.model';

@Component({
  standalone: true,
  selector: 'app-donation-complete-set-password-dialog',
  templateUrl: 'donation-complete-set-password-dialog.html',
  styleUrls: ['./donation-complete-set-password-dialog.component.scss'],
  imports: [
    ...allChildComponentImports,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
  ]
})
export class DonationCompleteSetPasswordDialogComponent implements OnInit {
  form: FormGroup;
  minPasswordLength: number;

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
        Validators.minLength(minPasswordLength),
      ]],
      stayLoggedIn: [false],
    });
    this.minPasswordLength = minPasswordLength;
  }

  set() {
    this.dialogRef.close({
      password: this.form.value.password,
      stayLoggedIn: [false], // logging in at this point was not working. See PR 972.
    });
  }
}
