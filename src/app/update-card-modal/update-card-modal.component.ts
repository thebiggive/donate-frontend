import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { allChildComponentImports } from '../../allChildComponentImports';
import {Card, PaymentMethod} from "@stripe/stripe-js";


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
  ],
})
export class UpdateCardModalComponent implements OnInit {
  updateCardForm: FormGroup;

  card: PaymentMethod.Card;
  formattedCardExpiry: string;

  constructor(
    private dialogRef: MatDialogRef<UpdateCardModalComponent>,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.updateCardForm = this.formBuilder.group({
      // add form fields
    });
  }

  setCard(card: PaymentMethod.Card) {
    this.card = card;

    this.formattedCardExpiry = card.exp_month.toString().padStart(2, "0") +  "/" + (card.exp_year % 100).toString()
  }
}
