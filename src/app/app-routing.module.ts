import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { MetaCampaignComponent } from './meta-campaign/meta-campaign.component';
import { SearchResultsComponent } from './search-results/search-results.component';

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
    path: 'search',
    component: SearchResultsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
