import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RecaptchaModule, RECAPTCHA_NONCE } from 'ng-recaptcha';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { CampaignDetailsCardComponent } from './campaign-details-card/campaign-details-card.component';
import { CampaignSearchFormComponent } from './campaign-search-form/campaign-search-form.component';
import { CharityComponent } from './charity/charity.component';
import { TBG_DONATE_STORAGE } from './donation.service';
import { DonationCompleteComponent } from './donation-complete/donation-complete.component';
import { DonationCompleteSetPasswordDialogComponent } from './donation-complete/donation-complete-set-password-dialog.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { DonationStartMatchConfirmDialogComponent } from './donation-start/donation-start-match-confirm-dialog.component';
import { DonationStartMatchingExpiredDialogComponent } from './donation-start/donation-start-matching-expired-dialog.component';
import { DonationStartOfferReuseDialogComponent } from './donation-start/donation-start-offer-reuse-dialog.component';
import { environment } from 'src/environments/environment';
import { ExactCurrencyPipe } from './exact-currency.pipe';
import { ExploreComponent } from './explore/explore.component';
import { FiltersComponent } from './filters/filters.component';
import { FiltersSelectDialogComponent } from './filters/filters-select-dialog.component';
import { FooterComponent } from './footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { TBG_DONATE_ID_STORAGE } from './identity.service';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MetaCampaignComponent } from './meta-campaign/meta-campaign.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TickerComponent } from './ticker/ticker.component';
import { TimeLeftPipe } from './time-left.pipe';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CampaignCardComponent,
    CampaignDetailsComponent,
    CampaignDetailsCardComponent,
    CampaignSearchFormComponent,
    CharityComponent,
    DonationCompleteComponent,
    DonationCompleteSetPasswordDialogComponent,
    DonationStartComponent,
    DonationStartMatchConfirmDialogComponent,
    DonationStartMatchingExpiredDialogComponent,
    DonationStartOfferReuseDialogComponent,
    ExactCurrencyPipe,
    FiltersComponent,
    FiltersSelectDialogComponent,
    FooterComponent,
    HeroComponent,
    MainMenuComponent,
    MetaCampaignComponent,
    NavigationComponent,
    ExploreComponent,
    TickerComponent,
    TimeLeftPipe,
    HomeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'donate-frontend' }),
    BrowserTransferStateModule,
    FlexLayoutModule,
    FontAwesomeModule,
    HttpClientModule,
    InfiniteScrollModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
  providers: [
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
  bootstrap: [AppComponent],
})
export class AppModule { }
