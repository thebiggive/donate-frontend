import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';

import { allChildComponentImports } from '../../allChildComponentImports';


@Component({
  standalone: true,
  selector: 'app-update-card-modal',
  templateUrl: 'update-card-modal.html',
  styleUrls: ['./update-card-modal.component.scss'],
  imports: [
    ...allChildComponentImports,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
})
export class UpdateCardModalComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;

  updateCardForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UpdateCardModalComponent>,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.updateCardForm = this.formBuilder.group({
      // add form fields
    });
  }
}
