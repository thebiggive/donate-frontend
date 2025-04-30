import { ActivatedRouteSnapshot, CanActivateFn, Router, Routes } from '@angular/router';

import { CampaignListResolver } from './campaign-list.resolver';
import { CampaignResolver } from './campaign.resolver';
import { CharityCampaignsResolver } from './charity-campaigns.resolver';
import { CampaignStatsResolver } from './campaign-stats-resolver';
import { HighlightCardsResolver } from './highlight-cards-resolver';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { flags } from './featureFlags';
import { MyDonationsComponent } from './my-donations/my-donations.component';
import { RegularGivingComponent } from './regular-giving/regular-giving.component';
import { MandateComponent } from './mandate/mandate.component';
import { MyPaymentMethodsComponent } from './my-payment-methods/my-payment-methods.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MandateResolver } from './mandate.resolver';
import { PaymentMethodsResolver } from './payment-methods.resolver';
import { PastDonationsResolver } from './past-donations.resolver';
import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

import { IdentityService } from './identity.service';
import { LoggedInPersonResolver } from './logged-in-person.resolver';
import { DonorAccountResolver } from './donor-account.resolver';
import { MyRegularGivingComponent } from './my-regular-giving/my-regular-giving.component';
import { NavigationService } from './navigation.service';
import { myMandatesResolver } from './my-mandates.resolver';
import { CancelMandateComponent } from './cancel-mandate/cancel-mandate.component';
import { ChangeRegularGivingComponent } from './change-regular-giving/change-regular-giving.component';
import { setupIntentResolver } from './setupIntent.resolver';
import { EmailVerificationTokenResolver } from './email-verification-token.resolver';
export const registerPath = 'register';
export const myAccountPath = 'my-account';
export const transferFundsPath = 'transfer-funds';
export const myRegularGivingPath = 'my-account/regular-giving';

const redirectIfAlreadyLoggedIn: CanActivateFn = (snapshot: ActivatedRouteSnapshot) => {
  if (isPlatformServer(inject(PLATFORM_ID))) {
    // Pages that require auth should not be server side rendered - we do not have auth creds on the server side.
    // Returning false should defer the decision about in-browser rendering to the client.
    // https://medium.com/@nijotigajo/handling-local-storage-in-angular-with-server-side-rendering-ssr-eaa6a0f11717
    return false;
  }

  const router = inject(Router);
  const requestedRedirect = snapshot.queryParams.r;
  const isLoggedIn = inject(IdentityService).probablyHaveLoggedInPerson();

  if (!isLoggedIn) {
    return true;
  } else {
    const redirectPath =
      requestedRedirect && NavigationService.isAllowableRedirectPath(requestedRedirect)
        ? `/${requestedRedirect}`
        : '/' + myAccountPath;
    return router.parseUrl(redirectPath);
  }
};

const requireLogin: CanActivateFn = (_activatedRouteSnapshot, routerStateSnapshot) => {
  if (isPlatformServer(inject(PLATFORM_ID))) {
    // No tokens -> Defer the decision about in-browser rendering to the client.
    return false;
  }

  const router = inject(Router);
  const isLoggedIn = inject(IdentityService).probablyHaveLoggedInPerson();

  if (isLoggedIn) {
    return true;
  }

  // on successful login the login page redirects back to My Account by default.
  // If we need to redirect to any other pages in future, we can take an ActivatedRouteSnapshot param here
  // and pass it to the login page as an 'r' query param.

  const redirectPath = routerStateSnapshot.url;
  if (redirectPath) {
    const query = new URLSearchParams({ r: redirectPath });
    const url = '/login?' + query.toString();
    return router.parseUrl(url);
  }
  return router.parseUrl('/login');
};

const handleLogout: CanActivateFn = () => {
  if (isPlatformServer(inject(PLATFORM_ID))) {
    // No tokens -> Defer the decision about in-browser rendering to the client.
    return false;
  }

  inject(IdentityService).logout();
  return inject(Router).parseUrl('/');
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    resolve: {
      stats: CampaignStatsResolver,
      highlights: HighlightCardsResolver,
    },
    loadChildren: () => import('./home/home.module').then((c) => c.HomeModule),
  },
  {
    path: transferFundsPath,
    pathMatch: 'full',
    canActivate: [requireLogin],
    loadChildren: () => import('./transfer-funds/transfer-funds.module').then((c) => c.TransferFundsModule),
  },
  {
    path: 'buy-credits',
    pathMatch: 'full',
    redirectTo: '/transfer-funds',
  },
  {
    path: 'campaign/:campaignId',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () => import('./campaign-details/campaign-details.module').then((c) => c.CampaignDetailsModule),
  },
  {
    path: 'charity/:charityId',
    pathMatch: 'full',
    resolve: {
      campaigns: CharityCampaignsResolver,
    },
    loadChildren: () => import('./charity/charity.module').then((c) => c.CharityModule),
  },
  {
    path: 'donate/:campaignId',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadChildren: () =>
      import('./donation-start/donation-start-container/donation-start-container.module').then(
        (c) => c.DonationStartContainerModule,
      ),
  },
  {
    path: 'donate-new-stepper/:campaignId',
    pathMatch: 'full',
    redirectTo: 'donate/:campaignId',
  },
  {
    path: `${myRegularGivingPath}/:mandateId/thanks`,
    pathMatch: 'full',
    component: MandateComponent,
    data: {
      isThanks: true,
    },
    canActivate: [requireLogin],
    resolve: {
      mandate: MandateResolver,
    },
  },
  {
    path: `${myRegularGivingPath}/:mandateId`,
    pathMatch: 'full',
    component: MandateComponent,
    canActivate: [requireLogin],
    resolve: {
      mandate: MandateResolver,
    },
  },
  {
    path: `${myRegularGivingPath}/:mandateId/cancel`,
    pathMatch: 'full',
    component: CancelMandateComponent,
    canActivate: [requireLogin],
  },
  {
    path: 'metacampaign/:campaignId',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
    loadChildren: () => import('./explore/explore.module').then((c) => c.ExploreModule),
  },
  {
    path: 'metacampaign/:campaignId/:fundSlug',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
    loadChildren: () => import('./explore/explore.module').then((c) => c.ExploreModule),
  },
  {
    path: 'reset-password',
    pathMatch: 'full',
    loadChildren: () => import('./reset-password/reset-password.module').then((c) => c.ResetPasswordModule),
  },
  {
    path: 'thanks/:donationId',
    pathMatch: 'full',
    loadChildren: () => import('./donation-thanks/donation-thanks.module').then((c) => c.DonationThanksModule),
  },
  {
    path: 'my-account/donations',
    resolve: {
      donations: PastDonationsResolver,
    },
    pathMatch: 'full',
    component: MyDonationsComponent,
    canActivate: [requireLogin],
  },
  {
    path: 'my-account/payment-methods',
    pathMatch: 'full',
    resolve: {
      person: LoggedInPersonResolver,
      paymentMethods: PaymentMethodsResolver,
    },
    component: MyPaymentMethodsComponent,
    canActivate: [requireLogin],
  },
  {
    path: ':campaignSlug/:fundSlug',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
    loadChildren: () => import('./explore/explore.module').then((c) => c.ExploreModule),
  },
  {
    path: 'explore',
    pathMatch: 'full',
    resolve: {
      campaigns: CampaignListResolver,
      highlights: HighlightCardsResolver,
    },
    loadChildren: () => import('./explore/explore.module').then((c) => c.ExploreModule),
  },
  {
    path: myAccountPath,
    pathMatch: 'full',
    canActivate: [requireLogin],
    loadChildren: () => import('./my-account/my-account.module').then((c) => c.MyAccountModule),
  },
  {
    path: registerPath,
    pathMatch: 'full',
    component: RegisterComponent,
    canActivate: [redirectIfAlreadyLoggedIn],
    resolve: {
      emailVerificationToken: EmailVerificationTokenResolver,
    },
  },
  /** For use when donor clicks logout in the menu on the wordpress site **/
  {
    component: LoginComponent, // Angular requires we set a component but it will never be used client-side as
    // `canActivate` always redirects there.
    path: 'logout',
    pathMatch: 'full',
    canActivate: [handleLogout],
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    canActivate: [redirectIfAlreadyLoggedIn],
  },
  {
    // The cookie preference center is a modal popup, not a full page. We need something behind it
    // else the site would look weird, so we load the homepage, and pass showCookiePreferences in data which the
    // app component will pick up to trigger auto opening the cookie preferences modal.
    path: 'cookie-preferences',
    pathMatch: 'full',
    resolve: {
      stats: CampaignStatsResolver,
      highlights: HighlightCardsResolver,
    },
    data: {
      showCookiePreferences: true,
    },
    loadChildren: () => import('./home/home.module').then((c) => c.HomeModule),
  },
  // This is effectively our no-or-one-forward-slashes 404 handler because we support any string as meta-campaign
  // slug (and optionally another as fund slug). So check `CampaignResolver` for adjusting what happens if the slug doesn't
  // match a campaign.
  {
    path: ':campaignSlug',
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
    loadChildren: () => import('./explore/explore.module').then((c) => c.ExploreModule),
  },
  // And this is our final 404 handler which actually says 'not found'; used for e.g. legacy /project/X/Y format paths.
  {
    path: '**',
    component: NotFoundComponent,
  },
];

if (flags.regularGivingEnabled) {
  routes.unshift({
    path: myRegularGivingPath,
    resolve: {
      mandates: myMandatesResolver,
    },
    pathMatch: 'full',
    component: MyRegularGivingComponent,
    canActivate: [requireLogin],
  });

  routes.unshift({
    path: 'my-account/payment-methods/change-regular-giving',
    resolve: {
      person: LoggedInPersonResolver,
      paymentMethods: PaymentMethodsResolver,
      setupIntent: setupIntentResolver,
    },
    pathMatch: 'full',
    component: ChangeRegularGivingComponent,
    canActivate: [requireLogin],
  });

  routes.unshift({
    path: 'regular-giving/:campaignId',
    pathMatch: 'full',
    component: RegularGivingComponent,
    canActivate: [requireLogin],
    resolve: {
      campaign: CampaignResolver,
      donor: LoggedInPersonResolver,
      donorAccount: DonorAccountResolver,
    },
  });
}
