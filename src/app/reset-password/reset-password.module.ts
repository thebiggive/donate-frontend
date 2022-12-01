import { NgModule } from '@angular/core';
import { allChildComponentImports } from '../../allChildComponentImports';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  imports: [
    ...allChildComponentImports,
    ResetPasswordRoutingModule,
  ],
  declarations: [ResetPasswordComponent],
})
export class ResetPasswordModule {}
