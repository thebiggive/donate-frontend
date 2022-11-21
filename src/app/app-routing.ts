import { Routes } from '@angular/router';

import { CampaignListResolver } from './campaign-list.resolver';
import { CampaignResolver } from './campaign.resolver';
import { CharityCampaignsResolver } from './charity-campaigns.resolver';

export const routes: Routes = [
  {
    path: 'buy-credits',
    loadChildren: () => import('./buy-credits/buy-credits.module')
      .then(c => c.BuyCreditsModule),
  },
  {
    path: 'campaign/:campaignId',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./campaign-details/campaign-details.module')
      .then(c => c.CampaignDetailsModule),
  },
  {
    path: 'charity/:charityId',
    resolve: {
      campaigns: CharityCampaignsResolver,
    },
    loadChildren: () => import('./charity/charity.module')
      .then(c => c.CharityModule),
  },
  {
    path: 'donate/:campaignId',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./donation-start/donation-start.module')
      .then(c => c.DonationStartModule),
  },
  {
    path: 'metacampaign/:campaignId',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./meta-campaign/meta-campaign.module')
      .then(c => c.MetaCampaignModule),
  },
  {
    path: 'metacampaign/:campaignId/:fundSlug',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./meta-campaign/meta-campaign.module')
      .then(c => c.MetaCampaignModule),
  },
  {
    path: 'thanks/:donationId',
    loadChildren: () => import('./donation-complete/donation-complete.module')
      .then(c => c.DonationCompleteModule),
  },
  {
    path: ':campaignSlug/:fundSlug',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./meta-campaign/meta-campaign.module')
      .then(c => c.MetaCampaignModule),
  },
  {
    path: 'explore',
    resolve: {
      campaigns: CampaignListResolver,
    },
    loadChildren: () => import('./explore/explore.module')
      .then(c => c.ExploreModule),
  },
  {
    path: ':campaignSlug',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./meta-campaign/meta-campaign.module')
      .then(c => c.MetaCampaignModule),
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module')
      .then(c => c.HomeModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
