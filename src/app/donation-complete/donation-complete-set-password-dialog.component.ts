import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { minPasswordLength } from 'src/environments/common';

import { RecaptchaModule } from 'ng-recaptcha';
import { allChildComponentImports } from '../../allChildComponentImports';
import { Person } from '../person.model';
import {PopupStandaloneComponent} from "../popup-standalone/popup-standalone.component";

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
    RecaptchaModule,
    PopupStandaloneComponent,
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
      stayLoggedIn: this.form.value.stayLoggedIn,
    });
  }
}
