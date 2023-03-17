import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatStepperModule } from '@angular/material/stepper';

import { allChildComponentImports } from '../../allChildComponentImports';
import { BuyCreditsComponent } from './buy-credits.component';
import { BuyCreditsRoutingModule } from './buy-credits-routing.module';
import { ExactCurrencyPipe } from '../exact-currency.pipe';
import { TimeLeftPipe } from '../time-left.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    BuyCreditsRoutingModule,
    ExactCurrencyPipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    ReactiveFormsModule,
    TimeLeftPipe,
  ],
  declarations: [BuyCreditsComponent],
})
export class BuyCreditsModule {}
