import { NgModule } from '@angular/core';
import { allChildComponentImports } from '../../allChildComponentImports';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  imports: [
    ...allChildComponentImports,
    ResetPasswordRoutingModule,
  ],
  declarations: [],
})
export class ResetPasswordModule {}
