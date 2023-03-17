import { NgModule } from '@angular/core';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {RecaptchaModule} from 'ng-recaptcha';

import { allChildComponentImports } from '../../allChildComponentImports';
import { DonationCompleteComponent } from './donation-complete.component';
import {DonationCompleteRoutingModule} from './donation-complete-routing.module';
import {ExactCurrencyPipe} from '../exact-currency.pipe';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  imports: [
    ...allChildComponentImports,
    DonationCompleteRoutingModule,
    ExactCurrencyPipe,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RecaptchaModule,
    FontAwesomeModule,
  ],
  declarations: [DonationCompleteComponent],
})
export class DonationCompleteModule {}
