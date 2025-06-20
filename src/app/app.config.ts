import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig,
  TitleStrategy,
} from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { defineCustomElements } from '@biggive/components/loader';
import { setAssetPath } from '@biggive/components/dist/components';
import { provideMatomo, withRouteData, withRouter } from 'ngx-matomo-client';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';
import { register as registerSwiper } from 'swiper/element/bundle';

import { routes } from './app.routes';
import { BigGiveTitleStrategy } from '../BigGiveTitleStrategy';
import { TBG_DONATE_STORAGE } from './donation.service';
import { environment } from '../environments/environment';

// In test environments, Cypress will set `window.__BIGGIVE_ASSET_PATH__` before this script runs.
// In other environments, we fall back to the environment variable or the window's origin.
const assetPath = (globalThis.window as any)?.__BIGGIVE_ASSET_PATH__ || `${environment.donateUriPrefix}/assets`;

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      registerSwiper();
      setAssetPath(assetPath);
      defineCustomElements();
    }),
    provideAnimationsAsync(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      // "This value should be set in case you use server-side rendering, but do not enable hydration for your application."
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      // Allows Explore & home logo links to clear search filters in ExploreComponent
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
    provideHttpClient(withFetch()), // For route resolvers etc.
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
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
