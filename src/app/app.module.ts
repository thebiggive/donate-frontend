import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { CampaignSearchFormComponent } from './campaign-search-form/campaign-search-form.component';
import { DonationCompleteComponent } from './donation-complete/donation-complete.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { DonationStartErrorDialogComponent } from './donation-start/donation-start-error-dialog.component';
import { DonationStartMatchConfirmDialogComponent } from './donation-start/donation-start-match-confirm-dialog.component';
import { DonationStartOfferReuseDialogComponent } from './donation-start/donation-start-offer-reuse-dialog.component';
import { MetaCampaignComponent } from './meta-campaign/meta-campaign.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TimeLeftPipe } from './time-left.pipe';
import { HeroComponent } from './hero/hero.component';
import { CardSectionComponent } from './card-section/card-section.component';
import { FiltersComponent } from './filters/filters.component';

@NgModule({
  declarations: [
    AppComponent,
    CampaignCardComponent,
    CampaignDetailsComponent,
    CampaignSearchFormComponent,
    DonationCompleteComponent,
    DonationStartComponent,
    DonationStartErrorDialogComponent,
    DonationStartMatchConfirmDialogComponent,
    DonationStartOfferReuseDialogComponent,
    SearchResultsComponent,
    MetaCampaignComponent,
    TimeLeftPipe,
    HeroComponent,
    CardSectionComponent,
    FiltersComponent,
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
    MatCarouselModule.forRoot(),
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
