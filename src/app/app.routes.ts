import { ActivatedRouteSnapshot, CanActivateFn, Resolve, ResolveFn, Route, Router } from '@angular/router';

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
import { inject, PLATFORM_ID, Type } from '@angular/core';

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
import { bigGiveName } from '../environments/common';

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

export const routes: (Route & {
  // every route should either have a title explicitly defined here, or explicitly have an undefined
  // title and rely on a call to PageMetaService.setCommon once loaded.

  // titles do not need to included 'Big Give' - if they don't it will be added by the BigGiveTitleStrategy class.
  title: string | Type<Resolve<string>> | ResolveFn<string> | undefined;
})[] = [
  {
    path: '',
    pathMatch: 'full',
    resolve: {
      stats: CampaignStatsResolver,
      highlights: HighlightCardsResolver,
    },
    title: bigGiveName,
    loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: transferFundsPath,
    pathMatch: 'full',
    canActivate: [requireLogin],
    title: 'Transfer Donation Funds',
    loadComponent: () => import('./transfer-funds/transfer-funds.component').then((c) => c.TransferFundsComponent),
  },
  {
    path: 'buy-credits',
    pathMatch: 'full',
    redirectTo: '/transfer-funds',
    title: undefined,
  },
  {
    path: 'campaign/:campaignId',
    title: undefined, // set from inside component using campaign name
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadComponent: () =>
      import('./campaign-details/campaign-details.component').then((c) => c.CampaignDetailsComponent),
  },
  {
    path: 'campaign-preview/:campaignId',
    title: undefined, // set from inside component using campaign name
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    data: { isEarlyPreview: true },
    loadComponent: () =>
      import('./campaign-details/campaign-details.component').then((c) => c.CampaignDetailsComponent),
  },
  {
    path: 'charity/:charityId',
    title: undefined, // set from inside component using charity name
    pathMatch: 'full',
    resolve: {
      campaigns: CharityCampaignsResolver,
    },
    loadComponent: () => import('./charity/charity.component').then((c) => c.CharityComponent),
  },
  {
    path: 'donate/:campaignId',
    title: undefined, // set from inside component using campaign name
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
    },
    loadComponent: () =>
      import('./donation-start/donation-start-container/donation-start-container.component').then(
        (c) => c.DonationStartContainerComponent,
      ),
  },
  {
    path: `${myRegularGivingPath}/:mandateId/thanks`,
    title: undefined, // set from inside component
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
    title: undefined, // set from inside component
    pathMatch: 'full',
    component: MandateComponent,
    canActivate: [requireLogin],
    resolve: {
      mandate: MandateResolver,
    },
  },
  {
    path: `${myRegularGivingPath}/:mandateId/cancel`,
    title: undefined, // set from inside component
    pathMatch: 'full',
    component: CancelMandateComponent,
    canActivate: [requireLogin],
  },
  {
    path: 'metacampaign/:campaignId',
    title: undefined, // set from inside component
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
    loadComponent: () => import('./explore/explore.component').then((c) => c.ExploreComponent),
  },
  {
    path: 'metacampaign/:campaignId/:fundSlug',
    title: undefined, // set from inside component
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
    loadComponent: () => import('./explore/explore.component').then((c) => c.ExploreComponent),
  },
  {
    path: 'reset-password',
    title: 'Reset your Password',
    pathMatch: 'full',
    loadComponent: () => import('./reset-password/reset-password.component').then((c) => c.ResetPasswordComponent),
  },
  {
    path: 'thanks/:donationId',
    title: undefined, // set from inside component
    pathMatch: 'full',
    loadComponent: () => import('./donation-thanks/donation-thanks.component').then((c) => c.DonationThanksComponent),
  },
  {
    path: 'my-account/donations',
    title: undefined, // set from inside component
    resolve: {
      donations: PastDonationsResolver,
    },
    pathMatch: 'full',
    component: MyDonationsComponent,
    canActivate: [requireLogin],
  },
  {
    path: 'my-account/payment-methods',
    title: 'Your Payment Methods',
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
    title: undefined, // set from inside component
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
    loadComponent: () => import('./explore/explore.component').then((c) => c.ExploreComponent),
  },
  {
    path: 'explore',
    title: undefined, // set from inside component
    pathMatch: 'full',
    resolve: {
      campaigns: CampaignListResolver,
      highlights: HighlightCardsResolver,
    },
    loadComponent: () => import('./explore/explore.component').then((c) => c.ExploreComponent),
  },
  {
    path: myAccountPath,
    title: undefined, // set from inside component
    pathMatch: 'full',
    canActivate: [requireLogin],
    loadComponent: () => import('./my-account/my-account.component').then((c) => c.MyAccountComponent),
  },
  {
    path: registerPath,
    title: undefined, // set from inside component
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
    title: undefined,
    path: 'logout',
    pathMatch: 'full',
    canActivate: [handleLogout],
  },
  {
    path: 'login',
    title: undefined, // set from inside component
    pathMatch: 'full',
    component: LoginComponent,
    canActivate: [redirectIfAlreadyLoggedIn],
  },
  {
    // The cookie preference center is a modal popup, not a full page. We need something behind it
    // else the site would look weird, so we load the homepage, and pass showCookiePreferences in data which the
    // app component will pick up to trigger auto opening the cookie preferences modal.
    path: 'cookie-preferences',
    title: undefined, // shows as a modal, awkward to give it its own title.
    pathMatch: 'full',
    resolve: {
      stats: CampaignStatsResolver,
      highlights: HighlightCardsResolver,
    },
    data: {
      showCookiePreferences: true,
    },
    loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent),
  },
  // This is effectively our no-or-one-forward-slashes 404 handler because we support any string as meta-campaign
  // slug (and optionally another as fund slug). So check `CampaignResolver` for adjusting what happens if the slug doesn't
  // match a campaign.
  {
    path: ':campaignSlug',
    title: undefined, // set from inside component
    pathMatch: 'full',
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
    loadComponent: () => import('./explore/explore.component').then((c) => c.ExploreComponent),
  },
  // And this is our final 404 handler which actually says 'not found'; used for e.g. legacy /project/X/Y format paths.
  {
    path: '**',
    title: 'Page not found',
    component: NotFoundComponent,
  },
];

if (flags.regularGivingEnabled) {
  routes.unshift({
    path: myRegularGivingPath,
    title: undefined, // set from inside component
    resolve: {
      mandates: myMandatesResolver,
    },
    pathMatch: 'full',
    component: MyRegularGivingComponent,
    canActivate: [requireLogin],
  });

  routes.unshift({
    path: 'my-account/payment-methods/change-regular-giving',
    title: 'Change Regular Giving Payment Method',
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
    title: undefined, // set from inside component
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
