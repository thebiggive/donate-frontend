import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonationCompleteComponent } from './donation-complete.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DonationCompleteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationCompleteRoutingModule {}
