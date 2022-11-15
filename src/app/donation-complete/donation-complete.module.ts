import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RecaptchaModule} from 'ng-recaptcha';

import { allChildComponentImports } from '../../allChildComponentImports';
import { DonationCompleteComponent } from './donation-complete.component';
import {DonationCompleteRoutingModule} from './donation-complete-routing.module';
import {ExactCurrencyPipe} from '../exact-currency.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    ...allChildComponentImports,
    DonationCompleteRoutingModule,
    ExactCurrencyPipe,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NoopAnimationsModule,
    RecaptchaModule,
  ],
  declarations: [DonationCompleteComponent],
})
export class DonationCompleteModule {}
