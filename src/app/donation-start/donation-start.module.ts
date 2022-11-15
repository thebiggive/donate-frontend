import {DatePipe, PercentPipe} from '@angular/common';
import { NgModule } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule} from '@angular/forms';
import {RecaptchaModule} from 'ng-recaptcha';

import { allChildComponentImports } from '../../allChildComponentImports';
import {CampaignDetailsCardComponent} from '../campaign-details-card/campaign-details-card.component';
import { DonationStartComponent } from './donation-start.component';
import {DonationStartRoutingModule} from './donation-start-routing.module';
import {ExactCurrencyPipe} from '../exact-currency.pipe';
import {TimeLeftPipe} from '../time-left.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    CampaignDetailsCardComponent,
    DatePipe,
    DonationStartRoutingModule,
    ExactCurrencyPipe,
    FlexLayoutModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    PercentPipe,
    ReactiveFormsModule,
    RecaptchaModule,
    TimeLeftPipe,
  ],
  declarations: [DonationStartComponent],
})
export class DonationStartModule {}
