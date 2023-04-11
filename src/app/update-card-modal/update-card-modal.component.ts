import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  ],
})
export class UpdateCardModalComponent implements OnInit {
  form: FormGroup;

  card: PaymentMethod.Card;
  formattedCardExpiry: string;
  billingDetails: PaymentMethod.BillingDetails;

  countryOptions = COUNTRIES;
  countryCode: string | undefined;
  postalCode: string | undefined;

  constructor(
    private dialogRef: MatDialogRef<UpdateCardModalComponent>,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      billingCountry: [this.countryCode],
      expiryDate: [this.formattedCardExpiry, [Validators.required]],
      postalCode: [this.postalCode],
    });
  }

  setPaymentMethod(card: PaymentMethod.Card, billingDetails: PaymentMethod.BillingDetails) {
    this.card = card;
    this.billingDetails = billingDetails
    this.countryCode = billingDetails.address?.country || undefined;
    this.postalCode = billingDetails.address?.postal_code || undefined

    this.formattedCardExpiry = card.exp_month.toString().padStart(2, "0") +  "/" + (card.exp_year % 100).toString()

    console.log("Country: " + this.billingDetails.address!.country)
  }
}
