import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonationStartComponent } from './donation-start.component';
import {DonationStartContainerComponent} from "./donation-start-container/donation-start-container.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DonationStartContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationStartRoutingModule {}
