import { DatePipe, PercentPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { allChildComponentImports } from '../../../allChildComponentImports';
import { CampaignInfoComponent } from '../../campaign-info/campaign-info.component';
import { ExactCurrencyPipe } from '../../exact-currency.pipe';
import { TimeLeftPipe } from '../../time-left.pipe';
import { CampaignDetailsModule } from '../../campaign-details/campaign-details.module';
import { DonationStartLoginComponent } from '../donation-start-login/donation-start-login.component';
import { DonationStartContainerComponent } from './donation-start-container.component';
import { DonationStartContainerRoutingModule } from './donation-start-routing.module';
import { DonationStartFormComponent } from '../donation-start-form/donation-start-form.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    ...allChildComponentImports,
    CampaignInfoComponent,
    DatePipe,
    DonationStartContainerRoutingModule,
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
    MatExpansionModule,
    PercentPipe,
    ReactiveFormsModule,
    TimeLeftPipe,
    CampaignDetailsModule,
  ],
  declarations: [
    DonationStartContainerComponent,
    DonationStartLoginComponent,
    DonationStartContainerComponent,
    DonationStartFormComponent,
  ],
  providers: [DatePipe],
})
export class DonationStartContainerModule {}
