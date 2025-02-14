import {ActivatedRouteSnapshot, CanActivateFn, ResolveFn, Router, Routes} from '@angular/router';

import {CampaignListResolver} from './campaign-list.resolver';
import {CampaignResolver} from './campaign.resolver';
import {CharityCampaignsResolver} from './charity-campaigns.resolver';
import {CampaignStatsResolver} from "./campaign-stats-resolver";
import {HighlightCardsResolver} from "./highlight-cards-resolver";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {flags} from "./featureFlags";
import {MyDonationsComponent} from "./my-donations/my-donations.component";
import {RegularGivingComponent} from "./regular-giving/regular-giving.component";
import {Person} from "./person.model";
import {MandateComponent} from "./mandate/mandate.component";
import {MyPaymentMethodsComponent} from "./my-payment-methods/my-payment-methods.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {DonorAccount} from "./donorAccount.model";
import {MandateResolver} from './mandate.resolver';
import {PaymentMethodsResolver} from './payment-methods.resolver';
import {PastDonationsResolver} from './past-donations.resolver';
import { isPlatformServer } from '@angular/common';
import {inject, PLATFORM_ID} from '@angular/core';
import {IdentityService} from './identity.service';

export const registerPath = 'register';
export const myAccountPath = 'my-account';
export const transferFundsPath = 'transfer-funds';
export const myRegularGivingPath = 'my-account/regular-giving';

const requireLogin: CanActivateFn = (_activatedRouteSnapshot, routerStateSnapshot) => {
  if (isPlatformServer(inject(PLATFORM_ID))) {
    // No tokens -> Defer the decision about in-browser rendering to the client.
    return false;
  }

  const router = inject(Router);
  const isLoggedIn = inject(IdentityService).probablyHaveLoggedInPerson();

  if ( isLoggedIn ) {
    return true;
  }

  // on successful login the login page redirects back to My Account by default.
  // If we need to redirect to any other pages in future, we can take an ActivatedRouteSnapshot param here
  // and pass it to the login page as an 'r' query param.

  const redirectPath = routerStateSnapshot.url
  if (redirectPath) {
    const query = new URLSearchParams({r: redirectPath})
    const url = '/login?' + query.toString();
    return router.parseUrl(url);
  }
  return router.parseUrl('/login');
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    resolve: {
      stats: CampaignStatsResolver,
      highlights: HighlightCardsResolver
    },
    loadChildren: () => import('./home/home.module')
      .then(c => c.HomeModule),
  },
  {
    path: transferFundsPath,
    pathMatch: 'full',
    canActivate: [
      requireLogin,
    ],
    loadChildren: () => import('./transfer-funds/transfer-funds.module')
      .then(c => c.TransferFundsModule),
  },
  {
    path: 'explore',
    pathMatch: 'full',
    resolve: {
      campaigns: CampaignListResolver,
      highlights: HighlightCardsResolver
    },
    loadChildren: () => import('./explore/explore.module')
      .then(c => c.ExploreModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];
