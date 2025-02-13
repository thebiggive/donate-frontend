import {ActivatedRouteSnapshot, CanActivateFn, ResolveFn, Router, Routes} from '@angular/router';

import {CampaignListResolver} from './campaign-list.resolver';
import {CampaignResolver} from './campaign.resolver';
import {CharityCampaignsResolver} from './charity-campaigns.resolver';
import {campaignStatsResolver} from "./campaign-stats-resolver";
import {HighlightCardsResolver} from "./highlight-cards.resolver";
import {LoginComponent, registerPath} from "./login/login.component";
import {forwardRef, inject, PLATFORM_ID} from "@angular/core";
import {IdentityService} from "./identity.service";
import {RegisterComponent} from "./register/register.component";
import {isPlatformServer} from "@angular/common";
import {flags} from "./featureFlags";
import {MyDonationsComponent} from "./my-donations/my-donations.component";
import {DonationService} from "./donation.service";
import {MyRegularGivingComponent} from "./my-regular-giving/my-regular-giving.component";
import {MandateService} from "./mandate.service";
import {myRegularGivingPath, RegularGivingComponent} from "./regular-giving/regular-giving.component";
import {Person} from "./person.model";
import {firstValueFrom} from "rxjs";
import {MandateComponent} from "./mandate/mandate.component";
import {Mandate} from "./mandate.model";
import {MyPaymentMethodsComponent} from "./my-payment-methods/my-payment-methods.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {DonorAccountService} from "./donor-account.service";
import {DonorAccount} from "./donorAccount.model";
import {NavigationService} from "./navigation.service";
import {MyAccountComponent, myAccountPath} from './my-account/my-account.component';
import {ExploreComponent} from './explore/explore.component';
import {DonationThanksComponent} from './donation-thanks/donation-thanks.component';
import {CharityComponent} from './charity/charity.component';
import {CampaignDetailsComponent} from './campaign-details/campaign-details.component';
import {
  DonationStartContainerComponent
} from './donation-start/donation-start-container/donation-start-container.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {HomeComponent} from './home/home.component';
import {TransferFundsComponent, transferFundsPath} from './transfer-funds/transfer-funds.component';

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

  if (! isLoggedIn) {
    return true;
  } else {
    const redirectPath = (requestedRedirect && NavigationService.isAllowableRedirectPath(requestedRedirect)) ?
      `/${requestedRedirect}` : '/' + myAccountPath
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

const handleLogout: CanActivateFn = () => {
  if (isPlatformServer(inject(PLATFORM_ID))) {
    // No tokens -> Defer the decision about in-browser rendering to the client.
    return false;
  }

  inject(IdentityService).logout();
  return inject(Router).parseUrl('/');
};

export const LoggedInPersonResolver: ResolveFn<Person | null> = async () => {
  const identityService = inject(IdentityService);

  const person$ = identityService.getLoggedInPerson();
  return await firstValueFrom(person$);
}

export const DonorAccountResolver: () => Promise<DonorAccount | null> = async () => {
  const loggedInDonorAccount$ = inject(DonorAccountService).getLoggedInDonorAccount();
  return await firstValueFrom(loggedInDonorAccount$);
};

export const mandateResolver: ResolveFn<Mandate> = async (route: ActivatedRouteSnapshot) => {
  const mandateService = inject(MandateService);
  const mandateId = route.paramMap.get('mandateId');
  if (!mandateId) {
    throw new Error('mandateId param missing in route');
  }
  const mandate$ = mandateService.getActiveMandate(mandateId);
  return await firstValueFrom(mandate$);
}

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    resolve: {
      // stats: campaignStatsResolver,
      highlights: HighlightCardsResolver,
    },
  },
  {
    path: transferFundsPath,
    pathMatch: 'full',
    component: TransferFundsComponent,
    canActivate: [
      requireLogin,
    ],
  },
  {
    path: 'buy-credits',
    pathMatch: 'full',
    redirectTo: "/transfer-funds"
  },
  {
    path: 'campaign/:campaignId',
    pathMatch: 'full',
    component: CampaignDetailsComponent,
    resolve: {
      campaign: CampaignResolver,
    },
  },
  {
    path: 'charity/:charityId',
    pathMatch: 'full',
    component: CharityComponent,
    resolve: {
      campaigns: CharityCampaignsResolver,
    },
  },
  {
    path: 'donate/:campaignId',
    pathMatch: 'full',
    component: DonationStartContainerComponent,
    resolve: {
      campaign: CampaignResolver,
    },
  },
  {
    path: 'donate-new-stepper/:campaignId',
    pathMatch: 'full',
    redirectTo: 'donate/:campaignId',
  },
  {
    path: 'metacampaign/:campaignId',
    pathMatch: 'full',
    component: ExploreComponent,
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
  },
  {
    path: 'metacampaign/:campaignId/:fundSlug',
    pathMatch: 'full',
    component: ExploreComponent,
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
  },
  {
    path: 'reset-password',
    pathMatch: 'full',
    component: ResetPasswordComponent,
  },
  {
    path: 'thanks/:donationId',
    pathMatch: 'full',
    component: forwardRef(() => DonationThanksComponent),
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
    path: 'my-account/payment-methods',
    pathMatch: 'full',
    resolve: {
      person: async () => await firstValueFrom(inject(IdentityService).getLoggedInPerson()),
      paymentMethods: async () => {
        return await inject(DonationService).getPaymentMethods();
      },
    },
    component: MyPaymentMethodsComponent,
    canActivate: [
      requireLogin,
    ],
  },
  {
    path: ':campaignSlug/:fundSlug',
    pathMatch: 'full',
    component: ExploreComponent,
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
  },
  {
    path: 'explore',
    pathMatch: 'full',
    component: ExploreComponent,
    resolve: {
      campaigns: CampaignListResolver,
      highlights: HighlightCardsResolver,
    },
  },
  {
    path: myAccountPath,
    pathMatch: 'full',
    component: MyAccountComponent,
    canActivate: [
      requireLogin,
    ],
  },
  {
    path: registerPath,
    pathMatch: 'full',
    component: RegisterComponent,
    canActivate: [
      redirectIfAlreadyLoggedIn,
    ],
  },
  /** For use when donor clicks logout in the menu on the wordpress site **/
  {
    component: LoginComponent, // Angular requires we set a component but it will never be used client-side as
                                    // `canActivate` always redirects there.
    path: 'logout',
    pathMatch: 'full',
    canActivate: [
      handleLogout,
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
    component: HomeComponent,
    resolve: {
      stats: campaignStatsResolver,
      highlights: HighlightCardsResolver,
    },
    data: {
      showCookiePreferences: true,
    },
  },
  // This is effectively our no-or-one-forward-slashes 404 handler because we support any string as meta-campaign
  // slug (and optionally another as fund slug). So check `CampaignResolver` for adjusting what happens if the slug doesn't
  // match a campaign.
  {
    path: ':campaignSlug',
    pathMatch: 'full',
    component: ExploreComponent,
    resolve: {
      campaign: CampaignResolver,
      highlights: HighlightCardsResolver,
    },
  },
  // And this is our final 404 handler which actually says 'not found'; used for e.g. legacy /project/X/Y format paths.
  {
    path: '**',
    component: NotFoundComponent,
  }
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
        donorAccount: DonorAccountResolver,
      },
    },
  )

  routes.unshift({
    path: `${myRegularGivingPath}/:mandateId`,
    pathMatch: 'full',
    component: MandateComponent,
    canActivate: [
      requireLogin,
    ],
    resolve: {
        mandate:  mandateResolver,
    },
  })
}

export {routes};
