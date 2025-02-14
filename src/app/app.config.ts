// todo probably delete? can't load app standalone for now.
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig
} from '@angular/router';

import { routes } from './app-routing';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {TBG_DONATE_STORAGE} from './donation.service';
import {LOCAL_STORAGE} from 'ngx-webstorage-service';
import {ComponentsModule} from '@biggive/components-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    ComponentsModule,
    { provide: TBG_DONATE_STORAGE, useExisting: LOCAL_STORAGE },
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(), // "This value is required for server-side rendering to work." https://angular.io/api/router/InitialNavigation
      withRouterConfig({ onSameUrlNavigation: 'reload' }), // Allows Explore & home logo links to clear search filters in ExploreComponent
      withInMemoryScrolling({scrollPositionRestoration: 'enabled'})
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ]
};
