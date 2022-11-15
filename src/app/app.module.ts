import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
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
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { TBG_DONATE_ID_STORAGE } from './identity.service';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    NavigationComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'donate-frontend' }),
    ComponentsModule,
    HttpClientModule,
    NoopAnimationsModule,
    RouterModule.forRoot(routes, {
      enableTracing: true, // TODO remove this when DON-634 resolved.
      initialNavigation: 'enabledBlocking', // "This value is required for server-side rendering to work." https://angular.io/api/router/InitialNavigation
      onSameUrlNavigation: 'ignore', // Allows Explore & home logo links to clear search filters in ExploreComponent – TODO change back to 'reload' after 15/11/22 DON-634 diagnostics.
      scrollPositionRestoration: 'enabled',
    }),
    RouterOutlet,
    TransferHttpCacheModule,
  ],
  providers: [
    CampaignListResolver,
    CampaignResolver,
    CharityCampaignsResolver,
    // In Universal / SSR mode, `APP_BASE_HREF` should vary according to the host reported
    // by the browser once client side JS takes over. This is necessary so we can successfully
    // serve the app on multiple live domains.
    {
      provide: APP_BASE_HREF,
      useFactory: () => {
        const globalDonateHost = (new URL(environment.donateGlobalUriPrefix)).host;
        const host = (typeof window === 'undefined' ? '' : window.location.host);

        return host === globalDonateHost
          ? environment.donateGlobalUriPrefix
          : environment.donateUriPrefix;
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
