import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { DonationCompleteComponent } from './donation-complete/donation-complete.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { MetaCampaignComponent } from './meta-campaign/meta-campaign.component';
import { ExploreComponent } from './explore/explore.component';

const routes: Routes = [
  {
    path: 'campaign/:campaignId',
    component: CampaignDetailsComponent,
  },
  {
    path: 'donate/:campaignId',
    component: DonationStartComponent,
  },
  {
    path: 'metacampaign/:campaignId',
    component: MetaCampaignComponent,
  },
  {
    path: 'metacampaign/:campaignId/:fundSlug',
    component: MetaCampaignComponent,
  },
  {
    path: 'thanks/:donationId',
    component: DonationCompleteComponent,
  },
  {
    path: ':campaignSlug/:fundSlug',
    component: MetaCampaignComponent,
  },
  {
    path: ':campaignSlug',
    component: MetaCampaignComponent,
  },
  {
    path: '',
    component: ExploreComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
