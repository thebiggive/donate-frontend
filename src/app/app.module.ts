import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule,
  MatInputModule,
  MatRadioModule,
  MatSlideToggleModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { CampaignSearchFormComponent } from './campaign-search-form/campaign-search-form.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { DonationStartMatchConfirmDialogComponent } from './donation-start/donation-start-match-confirm-dialog.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { MetaCampaignComponent } from './meta-campaign/meta-campaign.component';
import { TimeLeftPipe } from './time-left.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CampaignCardComponent,
    CampaignDetailsComponent,
    CampaignSearchFormComponent,
    DonationStartComponent,
    DonationStartMatchConfirmDialogComponent,
    SearchResultsComponent,
    MetaCampaignComponent,
    TimeLeftPipe,
  ],
  entryComponents: [
    DonationStartMatchConfirmDialogComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatGridListModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
