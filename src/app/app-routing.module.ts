import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';

const routes: Routes = [
  {
    path: 'donate/:campaignId',
    component: DonationStartComponent,
  },
  {
    path: 'search',
    component: SearchResultsComponent,
  },
  {
    path: 'campaign/:campaignId',
    component: CampaignDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
