import { Routes } from '@angular/router';

import { CampaignListResolver } from './campaign-list.resolver';
import { CampaignPromoted1Resolver } from './campaign-promoted-1.resolver';
import { CampaignPromoted2Resolver } from './campaign-promoted-2.resolver';
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
    loadComponent: () => import('./campaign-details/campaign-details.component')
      .then(c => c.CampaignDetailsComponent),
  },
  {
    path: 'charity/:charityId',
    resolve: {
      campaigns: CharityCampaignsResolver,
    },
    loadComponent: () => import('./charity/charity.component')
      .then(c => c.CharityComponent),
  },
  {
    path: 'donate/:campaignId',
    resolve: {
      campaign: CampaignResolver,
    },
    loadComponent: () => import('./donation-start/donation-start.component')
      .then(c => c.DonationStartComponent),
  },
  {
    path: 'metacampaign/:campaignId',
    resolve: {
      campaign: CampaignResolver,
    },
    loadComponent: () => import('./meta-campaign/meta-campaign.component')
      .then(c => c.MetaCampaignComponent),
  },
  {
    path: 'metacampaign/:campaignId/:fundSlug',
    resolve: {
      campaign: CampaignResolver,
    },
    loadComponent: () => import('./meta-campaign/meta-campaign.component')
      .then(c => c.MetaCampaignComponent),
  },
  {
    path: 'thanks/:donationId',
    loadComponent: () => import('./donation-complete/donation-complete.component')
      .then(c => c.DonationCompleteComponent),
  },
  {
    path: ':campaignSlug/:fundSlug',
    resolve: {
      campaign: CampaignResolver,
    },
    loadComponent: () => import('./meta-campaign/meta-campaign.component')
      .then(c => c.MetaCampaignComponent),
  },
  {
    path: 'explore',
    resolve: {
      campaigns: CampaignListResolver,
      promotedMetacampaign1: CampaignPromoted1Resolver,
      promotedMetacampaign2: CampaignPromoted2Resolver,
    },
    loadComponent: () => import('./explore/explore.component')
      .then(c => c.ExploreComponent),
  },
  {
    path: ':campaignSlug',
    resolve: {
      campaign: CampaignResolver,
    },
    loadComponent: () => import('./meta-campaign/meta-campaign.component')
      .then(c => c.MetaCampaignComponent),
  },
  {
    path: '',
    resolve: {
      campaigns: CampaignListResolver,
      promotedMetacampaign1: CampaignPromoted1Resolver,
      promotedMetacampaign2: CampaignPromoted2Resolver,
    },
    loadComponent: () => import('./home/home.component')
      .then(c => c.HomeComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
