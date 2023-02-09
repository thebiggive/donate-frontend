import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonationStartComponent } from './donation-start-2023-design.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DonationStartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationStartRoutingModule {}
