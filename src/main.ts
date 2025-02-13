import { enableProdMode } from '@angular/core';
import { setAssetPath } from '@biggive/components/dist/components';
import { register as registerSwiper } from 'swiper/element/bundle';
import { environment } from './environments/environment';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {
  provideRouter, RouterOutlet,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig
} from '@angular/router';
import {routes, DonorAccountResolver, LoggedInPersonResolver, mandateResolver} from './app/app-routing';
import {provideMatomo} from 'ngx-matomo-client';
import {TBG_DONATE_STORAGE} from './app/donation.service';
import {LOCAL_STORAGE} from 'ngx-webstorage-service';
import {CampaignResolver} from './app/campaign.resolver';
import {CampaignListResolver} from './app/campaign-list.resolver';
import {HighlightCardsResolver} from './app/highlight-cards.resolver';
import {ComponentsModule} from '@biggive/components-angular';

const matomoBaseUri = "https://biggive.matomo.cloud";
const matomoSiteId: string = (environment.matomoSiteId ?? 0).toString();

if (environment.productionLike) {
  enableProdMode();
}

setAssetPath(`${environment.donateUriPrefix}/assets`);

globalThis.document.addEventListener('DOMContentLoaded', () => {
  console.log('should bootstrap now!', routes);
  bootstrapApplication(
    AppComponent,
    {
      providers: [
        CampaignListResolver,
        CampaignResolver,
        ComponentsModule,
        // todo how do we use resolve fns in here? (or, make everything a class)
        // DonorAccountResolver,
        HighlightCardsResolver,
        // LoggedInPersonResolver,
        // mandateResolver,
        // todo check other injection tokens that might need this; reduce extraneous places this is `provide`d besides
        // this one.
        { provide: TBG_DONATE_STORAGE, useExisting: LOCAL_STORAGE },
        provideHttpClient(withInterceptorsFromDi()),
        provideMatomo({
          siteId: matomoSiteId,
          trackerUrl: matomoBaseUri,
          mode: 'auto',
          requireConsent: 'cookie',
        }),
        provideRouter(
          routes,
          withComponentInputBinding(),
          withEnabledBlockingInitialNavigation(), // "This value is required for server-side rendering to work." https://angular.io/api/router/InitialNavigation
          withRouterConfig({ onSameUrlNavigation: 'reload' }), // Allows Explore & home logo links to clear search filters in ExploreComponent
          withInMemoryScrolling({scrollPositionRestoration: 'enabled'})
        ),
      ],
    }
  )
    .catch(err => console.error(err));
});

registerSwiper();
