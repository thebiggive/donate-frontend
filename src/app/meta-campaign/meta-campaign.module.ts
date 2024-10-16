import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

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
    InfiniteScrollDirective,
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
