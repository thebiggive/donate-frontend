import { AsyncPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { allChildComponentImports } from '../../allChildComponentImports';
import { ExploreComponent } from './explore.component';
import {ExploreRoutingModule} from './explore-routing.module';
import {OptimisedImagePipe} from '../optimised-image.pipe';
import {HighlightCardsComponent} from "../highlight-cards/highlight-cards.component";

@NgModule({
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    ExploreRoutingModule,
    InfiniteScrollDirective,
    MatProgressSpinnerModule,
    OptimisedImagePipe,
    HighlightCardsComponent,
  ],
  declarations: [
    ExploreComponent,
  ],
  providers: [
    DatePipe,
  ],
})
export class ExploreModule {}
