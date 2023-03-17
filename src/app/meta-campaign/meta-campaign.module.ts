import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import { NgModule } from '@angular/core';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import { allChildComponentImports } from '../../allChildComponentImports';
import { MetaCampaignComponent } from './meta-campaign.component';
import {MetaCampaignRoutingModule} from './meta-campaign-routing.module';
import {OptimisedImagePipe} from '../optimised-image.pipe';
import {TimeLeftPipe} from '../time-left.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    CurrencyPipe,
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
