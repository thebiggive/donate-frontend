import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';

import { allChildComponentImports } from '../../allChildComponentImports';
import {Card, PaymentMethod} from "@stripe/stripe-js";
import {COUNTRIES} from "../countries";
import {MatOption, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";


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
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
})
export class UpdateCardModalComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;

  updateCardForm: FormGroup;

  card: PaymentMethod.Card;
  formattedCardExpiry: string;
  billingDetails: PaymentMethod.BillingDetails;

  countryOptions = COUNTRIES;

  constructor(
    private dialogRef: MatDialogRef<UpdateCardModalComponent>,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.updateCardForm = this.formBuilder.group({
      // add form fields
    });
  }

  setPaymentMethod(paymentMethod: PaymentMethod) {
    if (! paymentMethod.card) {
      throw new Error("Payment method does not have card");
    }

    const card = paymentMethod.card;
    this.card = card;
    this.billingDetails = paymentMethod.billing_details;

    this.formattedCardExpiry = card.exp_month.toString().padStart(2, "0") +  "/" + (card.exp_year % 100).toString()
  }
}
