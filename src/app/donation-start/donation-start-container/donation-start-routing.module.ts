import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonationStartContainerComponent } from './donation-start-container.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DonationStartContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationStartContainerRoutingModule {}
