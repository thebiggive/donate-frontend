import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { allChildComponentImports } from '../../allChildComponentImports';
import { DonationThanksComponent } from './donation-thanks.component';
import {DonationThanksRoutingModule} from './donation-thanks-routing.module';
import {ExactCurrencyPipe} from '../exact-currency.pipe';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  imports: [
    ...allChildComponentImports,
    DonationThanksRoutingModule,
    ExactCurrencyPipe,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
  ],
  declarations: [DonationThanksComponent],
  providers: []
})
export class DonationThanksModule {}
