import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig,
  TitleStrategy,
} from '@angular/router';
import { APP_BASE_HREF, isPlatformServer } from '@angular/common';
import { HttpInterceptorFn, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
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

export const donateSsrHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const token = inject(SSR_CLOUDFLARE_TOKEN, { optional: true });

  if (isPlatformServer(platformId) && token) {
    req = req.clone({
      setHeaders: {
        'X-TBG-Donate-SSR-Token': token,
      },
    });
  }

  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      registerSwiper();
      setAssetPath(`${environment.donateUriPrefix}/assets`);
      defineCustomElements();
    }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      // "This value should be set in case you use server-side rendering, but do not enable hydration for your application."
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      // Allows Explore & home logo links to clear search filters in ExploreComponent
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
    provideHttpClient(
      withFetch(), // For route resolvers etc.
      withInterceptors([donateSsrHeaderInterceptor]),
    ),
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
    { provide: APP_BASE_HREF, useValue: environment.donateUriPrefix },
    { provide: TBG_DONATE_STORAGE, useExisting: LOCAL_STORAGE },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: TitleStrategy, useClass: BigGiveTitleStrategy },
    { provide: ErrorHandler, useClass: BrowserErrorHandler },
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
