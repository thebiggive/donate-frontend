import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';

const routes: Routes = [
  {
    path: 'donate/:campaignId',
    component: DonationStartComponent,
  },
  {
    path: 'campaign/:campaignId',
    component: CampaignDetailsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
