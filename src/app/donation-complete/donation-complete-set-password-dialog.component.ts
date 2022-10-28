import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { Person } from '../person.model';

@Component({
  standalone: true,
  selector: 'app-donation-complete-set-password-dialog',
  templateUrl: 'donation-complete-set-password-dialog.html',
  styleUrls: ['./donation-complete-set-password-dialog.component.scss'],
  imports: [
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
  ]
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
      stayLoggedIn: [false],
    });
  }

  set() {
    this.dialogRef.close({
      password: this.form.value.password,
      stayLoggedIn: this.form.value.stayLoggedIn,
    });
  }
}
