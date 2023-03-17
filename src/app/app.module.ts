import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MAT_LEGACY_CHECKBOX_DEFAULT_OPTIONS as MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/legacy-checkbox';
import { MAT_LEGACY_RADIO_DEFAULT_OPTIONS as MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/legacy-radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ComponentsModule } from '@biggive/components-angular';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { RECAPTCHA_NONCE } from 'ng-recaptcha';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';

import { AppComponent } from './app.component';

import { routes } from './app-routing';
import { CampaignListResolver } from './campaign-list.resolver';
import { CampaignResolver } from './campaign.resolver';
import { CharityCampaignsResolver } from './charity-campaigns.resolver';
import { TBG_DONATE_STORAGE } from './donation.service';
import { environment } from '../environments/environment';
import { TBG_DONATE_ID_STORAGE } from './identity.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'donate-frontend' }),
    ComponentsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
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
    // In Universal / SSR mode, `APP_BASE_HREF` should vary according to the host reported
    // by the browser once client side JS takes over. This is necessary so we can successfully
    // serve the app on multiple live domains.
    {
      provide: APP_BASE_HREF,
      useFactory: () => {
        const ukDonateHost = (new URL(environment.donateUriPrefix)).host;
        const host = (typeof window === 'undefined' ? '' : window.location.host);

        return host === ukDonateHost
          ? environment.donateUriPrefix
          : environment.donateGlobalUriPrefix;
      },
    },
    { provide: TBG_DONATE_ID_STORAGE, useExisting: LOCAL_STORAGE },
    { provide: TBG_DONATE_STORAGE, useExisting: LOCAL_STORAGE },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: RECAPTCHA_NONCE, useValue: environment.recaptchaNonce },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
