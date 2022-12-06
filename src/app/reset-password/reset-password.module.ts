import { NgModule } from '@angular/core';
import { allChildComponentImports } from '../../allChildComponentImports';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    ...allChildComponentImports,
    MatProgressSpinnerModule,
    ResetPasswordRoutingModule,
  ],
  declarations: [],
})
export class ResetPasswordModule {}
