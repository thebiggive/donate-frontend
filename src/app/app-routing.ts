import {ActivatedRouteSnapshot, CanActivateFn, ResolveFn, Router, Routes} from '@angular/router';

import {CampaignListResolver} from './campaign-list.resolver';
import {CampaignResolver} from './campaign.resolver';
import {CharityCampaignsResolver} from './charity-campaigns.resolver';
import {campaignStatsResolver} from "./campaign-stats-resolver";
import {highlightCardsResolver} from "./highlight-cards-resolver";
import {isAllowableRedirectPath, LoginComponent} from "./login/login.component";
import {inject, PLATFORM_ID} from "@angular/core";
import {IdentityService} from "./identity.service";
import {RegisterComponent} from "./register/register.component";
import {isPlatformBrowser} from "@angular/common";
import {flags} from "./featureFlags";
import {MyDonationsComponent} from "./my-donations/my-donations.component";
import {DonationService} from "./donation.service";
import {MyRegularGivingComponent} from "./my-regular-giving/my-regular-giving.component";
import {MandateService} from "./mandate.service";
import {RegularGivingComponent} from "./regular-giving/regular-giving.component";
import {Person} from "./person.model";
import {firstValueFrom} from "rxjs";

export const registerPath = 'register';
export const myAccountPath = 'my-account';
export const transferFundsPath = 'transfer-funds';
export const myRegularGivingPath = 'my-account/regular-giving';

const redirectIfAlreadyLoggedIn = (snapshot: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const requestedRedirect = snapshot.queryParams.r;
  const isLoggedIn = inject(IdentityService).probablyHaveLoggedInPerson();

  if (! isLoggedIn) {
    return true;
  } else {
    const redirectPath = (requestedRedirect && isAllowableRedirectPath(requestedRedirect)) ?
      `/${requestedRedirect}` : '/' + myAccountPath
    return router.parseUrl(redirectPath);
  }
};

const requireLogin: CanActivateFn = (_activatedRouteSnapshot, routerStateSnapshot) => {
  if (! isPlatformBrowser(inject(PLATFORM_ID))) {
    // Pages that require auth should not be server side rendered - we do not have auth creds on the server side.
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

const LoggedInPersonResolver: ResolveFn<Person | null> = async () => {
  const identityService = inject(IdentityService);

  const person$ = identityService.getLoggedInPerson();
  return await firstValueFrom(person$);
}

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    resolve: {
      stats: campaignStatsResolver,
      highlights: highlightCardsResolver
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
    loadChildren: () => import('./explore/explore.module')
      .then(c => c.ExploreModule),
  },
  {
    path: 'metacampaign/:campaignId/:fundSlug',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./explore/explore.module')
      .then(c => c.ExploreModule),
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
    loadChildren: () => import('./donation-thanks/donation-thanks.module')
      .then(c => c.DonationThanksModule),
  },
  {
    path: 'my-account/donations',
    resolve: {
      donations: () => inject(DonationService).getPastDonations(),
    },
    pathMatch: 'full',
    component: MyDonationsComponent,
    canActivate: [
      requireLogin,
    ],
  },
  {
    path: ':campaignSlug/:fundSlug',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./explore/explore.module')
      .then(c => c.ExploreModule),
  },
  {
    path: 'explore',
    pathMatch: 'full',
    resolve: {
      campaigns: CampaignListResolver,
      highlights: highlightCardsResolver
    },
    loadChildren: () => import('./explore/explore.module')
      .then(c => c.ExploreModule),
  },
  {
    path: myAccountPath,
    pathMatch: 'full',
    canActivate: [
      requireLogin,
    ],
    loadChildren: () => import('./my-account/my-account.module')
      .then(c => c.MyAccountModule),
  },
  {
    path: registerPath,
    pathMatch: 'full',
    component: RegisterComponent,
    canActivate: [
      redirectIfAlreadyLoggedIn,
    ],
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    canActivate: [
      redirectIfAlreadyLoggedIn,
    ],
  },
  {
    // The cookie preference center is a modal popup, not a full page. We need something behind it
    // else the site would look weird, so we load the homepage, and pass showCookiePreferences in data which the
    // app component will pick up to trigger auto opening the cookie preferences modal.
    path: 'cookie-preferences',
    pathMatch: 'full',
    resolve: {
      stats: campaignStatsResolver,
      highlights: highlightCardsResolver
    },
    data: {
      showCookiePreferences: true,
    },
    loadChildren: () => import('./home/home.module')
      .then(c => c.HomeModule),
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
    loadChildren: () => import('./explore/explore.module')
      .then(c => c.ExploreModule),
  },
];

if (flags.regularGivingEnabled) {
  routes.unshift(
    {
      path: myRegularGivingPath,
      resolve: {
        mandates: () => inject(MandateService).getActiveMandates(),
      },
      pathMatch: 'full',
      component: MyRegularGivingComponent,
      canActivate: [
        requireLogin,
      ],
    },
  );

  routes.unshift(
    {
      path: 'regular-giving/:campaignId',
      pathMatch: 'full',
      component: RegularGivingComponent,
      canActivate: [
        requireLogin,
      ],
      resolve: {
        campaign: CampaignResolver,
        donor: LoggedInPersonResolver,
      },
    },
  )
}

export {routes};
