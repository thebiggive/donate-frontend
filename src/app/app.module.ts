import {APP_BASE_HREF, AsyncPipe, DatePipe} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, RouterOutlet} from '@angular/router';
import {ComponentsModule} from '@biggive/components-angular';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {RECAPTCHA_BASE_URL, RECAPTCHA_NONCE} from 'ng-recaptcha';
import {MatomoModule} from 'ngx-matomo';
import {LOCAL_STORAGE} from 'ngx-webstorage-service';

import {AppComponent} from './app.component';

import {routes} from './app-routing';
import {CampaignListResolver} from './campaign-list.resolver';
import {CampaignResolver} from './campaign.resolver';
import {CharityCampaignsResolver} from './charity-campaigns.resolver';
import {TBG_DONATE_STORAGE} from './donation.service';
import {environment} from '../environments/environment';
import {TBG_DONATE_ID_STORAGE} from './identity.service';
import {
  MatomoInitializationMode,
  NgxMatomoModule,
  NgxMatomoRouterModule,
  provideMatomo,
  withRouter
} from 'ngx-matomo-client';

const matomoBaseUri = 'https://biggive.matomo.cloud';
const matomoTrackers = environment.matomoSiteId ? [
  {
    trackerUrl: `${matomoBaseUri}/matomo.php`,
    siteId: environment.matomoSiteId,
  },
] : [];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AsyncPipe,
    BrowserAnimationsModule,
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    // Matomo module always imported, but with 0 trackers set if site ID omitted for the env.
    MatomoModule.forRoot({
      scriptUrl: `${matomoBaseUri}/matomo.js`,
      trackers: matomoTrackers,
      routeTracking: {
        enable: true,
      },
      requireCookieConsent: true,
    }),
    NgxMatomoModule.forRoot({
      siteId: environment.matomoSiteId,
      trackerUrl: `${matomoBaseUri}/matomo.js`,
      mode: MatomoInitializationMode.AUTO,
    }),
    NgxMatomoRouterModule.forRoot({}),
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
      initialNavigation: 'enabledBlocking', // "This value is required for server-side rendering to work." https://angular.io/api/router/InitialNavigation
      onSameUrlNavigation: 'reload', // Allows Explore & home logo links to clear search filters in ExploreComponent
      scrollPositionRestoration: 'enabled',
    }),
    RouterOutlet,
    TransferHttpCacheModule,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    CampaignListResolver,
    CampaignResolver,
    CharityCampaignsResolver,
    DatePipe,
    {
      provide: APP_BASE_HREF,
      useValue: environment.donateGlobalUriPrefix,
    },
    { provide: TBG_DONATE_ID_STORAGE, useExisting: LOCAL_STORAGE },
    { provide: TBG_DONATE_STORAGE, useExisting: LOCAL_STORAGE },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: RECAPTCHA_NONCE, useValue: environment.recaptchaNonce },
    {
      provide: RECAPTCHA_BASE_URL,
      useValue: 'https://recaptcha.net/recaptcha/api.js'  // using this URL instead of default google.com means we avoid google.com cookies.
    },
    provideMatomo({ trackerUrl: `${matomoBaseUri}/matomo.php`, siteId: environment.matomoSiteId}, withRouter())
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
