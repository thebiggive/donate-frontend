import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import { NgModule } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import { allChildComponentImports } from '../../allChildComponentImports';
import { MetaCampaignComponent } from './meta-campaign.component';
import {CampaignSearchFormComponent} from '../campaign-search-form/campaign-search-form.component';
import {FiltersComponent} from '../filters/filters.component';
import {MetaCampaignRoutingModule} from './meta-campaign-routing.module';
import {OptimisedImagePipe} from '../optimised-image.pipe';
import {TimeLeftPipe} from '../time-left.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    CampaignSearchFormComponent,
    CurrencyPipe,
    FiltersComponent,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    MetaCampaignRoutingModule,
    OptimisedImagePipe,
    TimeLeftPipe,
  ],
  declarations: [
    MetaCampaignComponent,
  ],
  providers: [
    DatePipe,
  ],
})
export class MetaCampaignModule {}
