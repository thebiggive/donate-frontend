import { NgModule } from '@angular/core';
import {ExactCurrencyPipe} from '../exact-currency.pipe';
import {DonationStartFormComponent} from "./donation-start-form.component";
import {CommonModule, PercentPipe} from "@angular/common";
import {MatStepperModule} from "@angular/material/stepper";
import {allChildComponentImports} from "../../allChildComponentImports";
import {DonationStartRoutingModule} from "../donation-start/donation-start-routing.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {RecaptchaModule} from "ng-recaptcha";
import {TimeLeftPipe} from "../time-left.pipe";
import {CampaignDetailsModule} from "../campaign-details/campaign-details.module";

@NgModule({
  imports: [
    ...allChildComponentImports,
    DonationStartRoutingModule,
    ExactCurrencyPipe,
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
    CampaignDetailsModule,
  ],
  declarations: [DonationStartFormComponent],
  exports: [
    DonationStartFormComponent
  ],
  providers: []
})
export class DonationStartFormModule {}
