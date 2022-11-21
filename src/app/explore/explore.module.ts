import { AsyncPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import { allChildComponentImports } from '../../allChildComponentImports';
import {CampaignSearchFormComponent} from '../campaign-search-form/campaign-search-form.component';
import { ExploreComponent } from './explore.component';
import {ExploreRoutingModule} from './explore-routing.module';
import {FiltersComponent} from '../filters/filters.component';
import {OptimisedImagePipe} from '../optimised-image.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    CampaignSearchFormComponent,
    ExploreRoutingModule,
    FiltersComponent,
    FlexLayoutModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    OptimisedImagePipe,
  ],
  declarations: [
    ExploreComponent,
  ],
  providers: [
    DatePipe,
  ],
})
export class ExploreModule {}
