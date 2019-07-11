import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationStartComponent } from './donation-start/donation-start.component';

const routes: Routes = [
  {
    path: 'donate/:campaignId',
    component: DonationStartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
