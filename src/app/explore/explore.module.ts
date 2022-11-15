import { NgModule } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import { allChildComponentImports } from '../../allChildComponentImports';
import {CampaignSearchFormComponent} from '../campaign-search-form/campaign-search-form.component';
import { ExploreComponent } from './explore.component';
import {ExploreRoutingModule} from './explore-routing.module';
import {FiltersComponent} from '../filters/filters.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {OptimisedImagePipe} from '../optimised-image.pipe';
import { PromotedCampaignsComponent } from '../promoted-campaigns/promoted-campaigns.component';

@NgModule({
  imports: [
    ...allChildComponentImports,
    CampaignSearchFormComponent,
    ExploreRoutingModule,
    FiltersComponent,
    FlexLayoutModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    OptimisedImagePipe,
    PromotedCampaignsComponent,
  ],
  declarations: [ExploreComponent],
})
export class ExploreModule {}
