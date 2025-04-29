import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonationThanksComponent } from './donation-thanks.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DonationThanksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationThanksRoutingModule {}
