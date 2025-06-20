import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PaymentMethod } from '@stripe/stripe-js';
import { COUNTRIES } from '../countries';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PopupStandaloneComponent } from '../popup-standalone/popup-standalone.component';

@Component({
  selector: 'app-update-card-modal',
  templateUrl: 'update-card-modal.html',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    PopupStandaloneComponent,
  ],
})
export class UpdateCardModalComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<UpdateCardModalComponent>>(MatDialogRef);
  private formBuilder = inject(FormBuilder);

  form!: FormGroup;
  card?: PaymentMethod.Card;
  formattedCardExpiry?: string;
  readonly COUNTRIES = COUNTRIES;
  countryCode: string | undefined;
  postalCode: string | undefined;

  ngOnInit() {
    this.form = this.formBuilder.group({
      billingCountry: [this.countryCode],
      expiryDate: [this.formattedCardExpiry, [Validators.required]],
      postalCode: [this.postalCode],
    });
  }

  setPaymentMethod(card: PaymentMethod.Card, billingDetails: PaymentMethod.BillingDetails) {
    this.card = card;
    this.countryCode = billingDetails.address?.country || undefined;
    this.postalCode = billingDetails.address?.postal_code || undefined;

    this.formattedCardExpiry = card.exp_month.toString().padStart(2, '0') + '/' + (card.exp_year % 100).toString();
  }
}
