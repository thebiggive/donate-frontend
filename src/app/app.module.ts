import {APP_BASE_HREF, AsyncPipe, DatePipe} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, RouterOutlet} from '@angular/router';
import {ComponentsModule} from '@biggive/components-angular';
import {RECAPTCHA_LOADER_OPTIONS} from 'ng-recaptcha';
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
  MatomoConsentMode,
  MatomoInitializationMode,
  MatomoModule, MatomoRouterModule
} from 'ngx-matomo-client';

const matomoBaseUri = 'https://biggive.matomo.cloud';

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
    ...(environment.matomoSiteId ? [MatomoModule.forRoot({
      siteId: environment.matomoSiteId,
      trackerUrl: matomoBaseUri,
      mode: MatomoInitializationMode.AUTO,
      requireConsent: MatomoConsentMode.COOKIE,
    })] : []),
    MatomoRouterModule.forRoot({}),
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
      initialNavigation: 'enabledBlocking', // "This value is required for server-side rendering to work." https://angular.io/api/router/InitialNavigation
      onSameUrlNavigation: 'reload', // Allows Explore & home logo links to clear search filters in ExploreComponent
      scrollPositionRestoration: 'enabled',
    }),
    RouterOutlet,
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
      useValue: environment.donateUriPrefix,
    },
    { provide: TBG_DONATE_ID_STORAGE, useExisting: LOCAL_STORAGE },
    { provide: TBG_DONATE_STORAGE, useExisting: LOCAL_STORAGE },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    {
      provide: RECAPTCHA_LOADER_OPTIONS,
      useValue: {
        onBeforeLoad(_url: any) {
          return {
            baseUrl: 'https://recaptcha.net/recaptcha/api.js', // using this URL instead of default google.com means we avoid google.com cookies.
            nonce: environment.recaptchaNonce,
          };
        },
      },
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
