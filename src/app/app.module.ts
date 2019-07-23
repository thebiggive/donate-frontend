import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatRadioModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DonationStartComponent } from './donation-start/donation-start.component';
import { CampaignSearchFormComponent } from './campaign-search-form/campaign-search-form.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';

@NgModule({
  declarations: [
    AppComponent,
    CampaignSearchFormComponent,
    DonationStartComponent,
    SearchResultsComponent,
    CampaignDetailsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
