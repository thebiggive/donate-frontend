import { NgModule } from '@angular/core';
import { allChildComponentImports } from '../../allChildComponentImports';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

@NgModule({
  imports: [
    ...allChildComponentImports,
    MatProgressSpinnerModule,
    ResetPasswordRoutingModule,
  ],
  declarations: [],
})
export class ResetPasswordModule {}
