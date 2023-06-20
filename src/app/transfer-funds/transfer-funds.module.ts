import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

import { allChildComponentImports } from '../../allChildComponentImports';
import { TransferFundsComponent } from './transfer-funds.component';
import { TransferFundsRoutingModule } from './transfer-funds-routing.module';
import { ExactCurrencyPipe } from '../exact-currency.pipe';
import { TimeLeftPipe } from '../time-left.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    TransferFundsRoutingModule,
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
  declarations: [TransferFundsComponent],
})
export class TransferFundsModule {}
