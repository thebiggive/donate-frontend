import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferFundsComponent } from './transfer-funds.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TransferFundsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferFundsRoutingModule {}
