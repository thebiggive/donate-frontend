import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { CampaignSearchFormComponent } from './campaign-search-form/campaign-search-form.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { DonationStartErrorDialogComponent } from './donation-start/donation-start-error-dialog.component';
import { DonationStartMatchConfirmDialogComponent } from './donation-start/donation-start-match-confirm-dialog.component';
import { DonationStartOfferReuseDialogComponent } from './donation-start/donation-start-offer-reuse-dialog.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { MetaCampaignComponent } from './meta-campaign/meta-campaign.component';
import { TimeLeftPipe } from './time-left.pipe';
import { DonationCompleteComponent } from './donation-complete/donation-complete.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NavSearchFormComponent } from './nav-search-form/nav-search-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CampaignCardComponent,
    CampaignDetailsComponent,
    CampaignSearchFormComponent,
    DonationStartComponent,
    DonationStartErrorDialogComponent,
    DonationStartMatchConfirmDialogComponent,
    DonationStartOfferReuseDialogComponent,
    SearchResultsComponent,
    MetaCampaignComponent,
    TimeLeftPipe,
    DonationCompleteComponent,
    NavigationComponent,
    NavSearchFormComponent,
  ],
  entryComponents: [
    DonationStartErrorDialogComponent,
    DonationStartMatchConfirmDialogComponent,
    DonationStartOfferReuseDialogComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'donate-frontend' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatGridListModule,
    MatInputModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatCarouselModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
