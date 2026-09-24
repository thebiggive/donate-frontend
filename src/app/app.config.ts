import { ApplicationConfig, ErrorHandler, inject, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  TitleStrategy,
} from '@angular/router';
import { APP_BASE_HREF, isPlatformServer } from '@angular/common';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';
import { defineCustomElements } from '@biggive/components/loader';
import { setAssetPath } from '@biggive/components/dist/components';
import { provideMatomo, withRouteData, withRouter } from 'ngx-matomo-client';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';
import { register as registerSwiper } from 'swiper/element/bundle';

import { routes } from './app.routes';
import { BigGiveTitleStrategy } from '../BigGiveTitleStrategy';
import { TBG_DONATE_STORAGE } from './donation.service';
import { environment } from '../environments/environment';
import { BrowserErrorHandler } from './BrowserErrorHandler';
import { SSR_CLOUDFLARE_TOKEN } from './ssr-token';

const internalApiHosts = [new URL(environment.matchbotApiOrigin).host, new URL(environment.identityApiPrefix).host];

export const donateSsrHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const token = inject(SSR_CLOUDFLARE_TOKEN, { optional: true });

  if (isPlatformServer(platformId) && token && internalApiHosts.includes(new URL(req.url).host)) {
    req = req.clone({
      setHeaders: {
        'X-TBG-Donate-SSR-Token': token,
      },
    });
  }

  return next(req);
};

// Current purpose is to ensure Cloudflare clearance cookies can be sent on to MatchBot & Identity. Unlike the above
// this can happen regardless of whether the request is server or client side.
export const apiAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (internalApiHosts.includes(new URL(req.url).host)) {
    req = req.clone({
      withCredentials: true,
    });
  }

  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(async () => {
      registerSwiper();
      setAssetPath(`${environment.donateUriPrefix}/assets`);
      if (globalThis.window) {
        await defineCustomElements();
      }
    }),
    provideClientHydration(withNoIncrementalHydration()), // @todo DON-1189 Possibly bring back incremental once we fix inlince script CSP nonces
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      // Allows Explore & home logo links to clear search filters in ExploreComponent
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
    // For route resolvers etc.
    provideHttpClient(withInterceptors([apiAuthInterceptor, donateSsrHeaderInterceptor])),
    provideMatomo(
      {
        siteId: environment.matomoSiteId?.toString() || '',
        trackerUrl: 'https://biggive.matomo.cloud',
        mode: 'auto',
        requireConsent: 'cookie',
      },
      withRouter(),
      withRouteData(),
    ),
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: TBG_DONATE_STORAGE, useExisting: LOCAL_STORAGE },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: TitleStrategy, useClass: BigGiveTitleStrategy },
    { provide: ErrorHandler, useClass: BrowserErrorHandler },
  ],
};
