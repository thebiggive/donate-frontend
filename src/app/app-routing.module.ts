import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';

import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { CampaignListResolver } from './campaign-list.resolver';
import { CampaignResolver } from './campaign.resolver';
import { CharityCampaignsResolver } from './charity-campaigns.resolver';
import { CharityComponent } from './charity/charity.component';
import { DonationCompleteComponent } from './donation-complete/donation-complete.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { ExploreComponent } from './explore/explore.component';
import { HomeComponent } from './home/home.component';
import { MetaCampaignComponent } from './meta-campaign/meta-campaign.component';
import { MulticurrencyCampaignResolver } from './multicurrency-campaign.resolver';
import { MulticurrencyCampaignListResolver } from './multicurrency-campaign-list.resolver';
import { MulticurrencyLandingComponent } from './multicurrency-landing/multicurrency-landing.component';

const rootPath = environment.redirectHomepageToChirstmasChallenge ? {
  path: '',
  redirectTo: 'christmas-challenge-2021',
  pathMatch: 'full',
} : {
  path: '',
  component: HomeComponent,
  resolve: {
    campaigns: CampaignListResolver,
  },
};

const routes: Routes = [
  {
    path: 'campaign/:campaignId',
    component: CampaignDetailsComponent,
    resolve: {
      campaign: CampaignResolver,
    },
  },
  {
    path: 'charity/:charityId',
    component: CharityComponent,
    resolve: {
      campaigns: CharityCampaignsResolver,
    },
  },
  {
    path: 'donate/:campaignId',
    component: DonationStartComponent,
    resolve: {
      campaign: CampaignResolver,
    },
  },
  {
    path: 'metacampaign/:campaignId',
    component: MetaCampaignComponent,
    resolve: {
      campaign: CampaignResolver,
    },
  },
  {
    path: 'metacampaign/:campaignId/:fundSlug',
    component: MetaCampaignComponent,
    resolve: {
      campaign: CampaignResolver,
    },
  },
  {
    path: 'thanks/:donationId',
    component: DonationCompleteComponent,
  },
  {
    path: ':campaignSlug/:fundSlug',
    component: MetaCampaignComponent,
    resolve: {
      campaign: CampaignResolver,
    },
  },
  {
    path: 'explore',
    component: ExploreComponent,
  },
  {
    path: 'gogiveone',
    component: MulticurrencyLandingComponent,
    resolve: {
      campaign: MulticurrencyCampaignResolver,
      campaigns: MulticurrencyCampaignListResolver,
    },
  },
  {
    path: 'women-and-girls-match-fund-2021',
    redirectTo: 'women-and-girls-match-fund-2022',
    pathMatch: 'full',
  },
  {
    path: ':campaignSlug',
    component: MetaCampaignComponent,
    resolve: {
      campaign: CampaignResolver,
    },
  },
  rootPath,
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    onSameUrlNavigation: 'reload', // Allows Explore & home logo links to clear search filters in ExploreComponent
    scrollPositionRestoration: 'enabled',
  })],
  providers: [
    CampaignResolver,
    CampaignListResolver,
    CharityCampaignsResolver,
    MulticurrencyCampaignResolver,
    MulticurrencyCampaignListResolver,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
