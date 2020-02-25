import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { CampaignDetailsCardComponent } from './campaign-details-card/campaign-details-card.component';
import { CampaignSearchFormComponent } from './campaign-search-form/campaign-search-form.component';
import { TBG_DONATE_STORAGE } from './donation.service';
import { DonationCompleteComponent } from './donation-complete/donation-complete.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { DonationStartErrorDialogComponent } from './donation-start/donation-start-error-dialog.component';
import { DonationStartMatchConfirmDialogComponent } from './donation-start/donation-start-match-confirm-dialog.component';
import { DonationStartOfferReuseDialogComponent } from './donation-start/donation-start-offer-reuse-dialog.component';
import { FiltersComponent } from './filters/filters.component';
import { FooterComponent } from './footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { MetaCampaignComponent } from './meta-campaign/meta-campaign.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NavSearchFormComponent } from './nav-search-form/nav-search-form.component';
import { ExploreComponent } from './explore/explore.component';
import { TickerComponent } from './ticker/ticker.component';
import { TimeLeftPipe } from './time-left.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CampaignCardComponent,
    CampaignDetailsComponent,
    CampaignDetailsCardComponent,
    CampaignSearchFormComponent,
    DonationCompleteComponent,
    DonationStartComponent,
    DonationStartErrorDialogComponent,
    DonationStartMatchConfirmDialogComponent,
    DonationStartOfferReuseDialogComponent,
    FiltersComponent,
    FooterComponent,
    HeroComponent,
    MetaCampaignComponent,
    NavigationComponent,
    NavSearchFormComponent,
    ExploreComponent,
    TickerComponent,
    TimeLeftPipe,
  ],
  entryComponents: [
    DonationStartErrorDialogComponent,
    DonationStartMatchConfirmDialogComponent,
    DonationStartOfferReuseDialogComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'donate-frontend' }),
    BrowserTransferStateModule,
    FlexLayoutModule,
    HttpClientModule,
    InfiniteScrollModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: TBG_DONATE_STORAGE, useExisting: LOCAL_STORAGE },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
