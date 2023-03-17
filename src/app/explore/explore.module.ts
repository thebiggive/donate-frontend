import { AsyncPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import { allChildComponentImports } from '../../allChildComponentImports';
import { ExploreComponent } from './explore.component';
import {ExploreRoutingModule} from './explore-routing.module';
import {OptimisedImagePipe} from '../optimised-image.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    ExploreRoutingModule,
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
