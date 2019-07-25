import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatInputModule,
  MatRadioModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { CampaignSearchFormComponent } from './campaign-search-form/campaign-search-form.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { MetaCampaignComponent } from './meta-campaign/meta-campaign.component';

@NgModule({
  declarations: [
    AppComponent,
    CampaignCardComponent,
    CampaignSearchFormComponent,
    DonationStartComponent,
    SearchResultsComponent,
    CampaignDetailsComponent,
    MetaCampaignComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
