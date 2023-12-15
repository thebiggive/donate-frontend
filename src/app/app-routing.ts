import {ActivatedRouteSnapshot, Router, Routes} from '@angular/router';

import {CampaignListResolver} from './campaign-list.resolver';
import {CampaignResolver} from './campaign.resolver';
import {CharityCampaignsResolver} from './charity-campaigns.resolver';
import {campaignStatsResolver} from "./campaign-stats-resolver";
import {isAllowableRedirectPath, LoginComponent} from "./login/login.component";
import {inject} from "@angular/core";
import {IdentityService} from "./identity.service";
import { flags } from './featureFlags';

const redirectFromLoginIfLoggedIn = (snapshot: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const requestedRedirect = snapshot.queryParams.r;
  const isLoggedIn = inject(IdentityService).probablyHaveLoggedInPerson();

  if (! isLoggedIn) {
    return true;
  } else {
    const redirectPath = (requestedRedirect && isAllowableRedirectPath(requestedRedirect)) ?
      `/${requestedRedirect}` : '/my-account'
    return router.parseUrl(redirectPath);
  }
};

const redirectFromMyAccount = () => {
  const router = inject(Router);
  const isLoggedIn = inject(IdentityService).probablyHaveLoggedInPerson();

  if ( isLoggedIn ) {
    return true;
  } else if (! flags.loginPageEnabled ) {
    return true;
  }

  // on successful login the login page redirects back to My Account by default.
  // If we need to redirect to any other pages in future, we can take an ActivatedRouteSnapshot param here
  // and pass it to the login page as an 'r' query param.
  return router.parseUrl('/login');
};

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    resolve: {
      stats: campaignStatsResolver,
    },
    loadChildren: () => import('./home/home.module')
      .then(c => c.HomeModule),
  },
  {
    path: 'transfer-funds',
    pathMatch: 'full',
    loadChildren: () => import('./transfer-funds/transfer-funds.module')
      .then(c => c.TransferFundsModule),
  },
  {
    path: 'buy-credits',
    pathMatch: 'full',
    redirectTo: "/transfer-funds"
  },
  {
    path: 'campaign/:campaignId',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./campaign-details/campaign-details.module')
      .then(c => c.CampaignDetailsModule),
  },
  {
    path: 'charity/:charityId',
    pathMatch: 'full',
    resolve: {
      campaigns: CharityCampaignsResolver,
    },
    loadChildren: () => import('./charity/charity.module')
      .then(c => c.CharityModule),
  },
  {
    path: 'donate/:campaignId',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./donation-start/donation-start-container/donation-start-container.module')
      .then(c => c.DonationStartContainerModule),
  },
  {
    path: 'donate-new-stepper/:campaignId',
    pathMatch: 'full',
    redirectTo: 'donate/:campaignId',
  },
  {
    path: 'metacampaign/:campaignId',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./meta-campaign/meta-campaign.module')
      .then(c => c.MetaCampaignModule),
  },
  {
    path: 'metacampaign/:campaignId/:fundSlug',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./meta-campaign/meta-campaign.module')
      .then(c => c.MetaCampaignModule),
  },
  {
    path: 'reset-password',
    pathMatch: 'full',
    loadChildren: () => import('./reset-password/reset-password.module')
      .then(c => c.ResetPasswordModule),
  },
  {
    path: 'thanks/:donationId',
    pathMatch: 'full',
    loadChildren: () => import('./donation-complete/donation-complete.module')
      .then(c => c.DonationCompleteModule),
  },
  {
    path: ':campaignSlug/:fundSlug',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./meta-campaign/meta-campaign.module')
      .then(c => c.MetaCampaignModule),
  },
  {
    path: 'explore',
    pathMatch: 'full',
    resolve: {
      campaigns: CampaignListResolver,
    },
    loadChildren: () => import('./explore/explore.module')
      .then(c => c.ExploreModule),
  },
  {
    path: 'my-account',
    pathMatch: 'full',
    canActivate: [
      redirectFromMyAccount,
    ],
    loadChildren: () => import('./my-account/my-account.module')
      .then(c => c.MyAccountModule),
  },
  // This is effectively our 404 handler because we support any string as meta-campaign
  // slug. So check `CampaignResolver` for adjusting what happens if the slug doesn't
  // match a campaign.
  {
    path: ':campaignSlug',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./meta-campaign/meta-campaign.module')
      .then(c => c.MetaCampaignModule),
  },
];

if (flags.loginPageEnabled ) {
  routes.unshift(
    {
      path: 'login',
      pathMatch: 'full',
      component: LoginComponent,
      canActivate: [
        redirectFromLoginIfLoggedIn,
      ],
    },
  );
}

export {routes};
