import {APP_BASE_HREF, AsyncPipe, CommonModule, DatePipe} from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {CUSTOM_ELEMENTS_SCHEMA, Injectable, NgModule, provideExperimentalZonelessChangeDetection} from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from "@angular/material/checkbox";
import { MAT_RADIO_DEFAULT_OPTIONS } from "@angular/material/radio";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import { ComponentsModule } from "@biggive/components-angular";
import { LOCAL_STORAGE } from "ngx-webstorage-service";

import { AppComponent } from "./app.component";

import { routes } from "./app-routing";
import { CampaignListResolver } from "./campaign-list.resolver";
import { CampaignResolver } from "./campaign.resolver";
import { CharityCampaignsResolver } from "./charity-campaigns.resolver";
import { TBG_DONATE_STORAGE } from "./donation.service";
import { environment } from "../environments/environment";
import { TBG_DONATE_ID_STORAGE } from "./identity.service";
import { MatomoModule, MatomoRouterModule} from "ngx-matomo-client";

const matomoBaseUri = "https://biggive.matomo.cloud";

@NgModule({
  declarations: [AppComponent],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  imports: [
    AsyncPipe,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    ComponentsModule,
    ...(environment.matomoSiteId
      ? [
          MatomoModule.forRoot({
            siteId: environment.matomoSiteId,
            trackerUrl: matomoBaseUri,
            mode: 'auto',
            requireConsent: 'cookie',
          }),
        ]
      : []),
    MatomoRouterModule.forRoot({}),
    RouterLink,
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
      initialNavigation: "enabledBlocking", // "This value is required for server-side rendering to work." https://angular.io/api/router/InitialNavigation
      onSameUrlNavigation: "reload", // Allows Explore & home logo links to clear search filters in ExploreComponent
      scrollPositionRestoration: "enabled",
    }),
    RouterOutlet,
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
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: "primary" } },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: "primary" } },
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
