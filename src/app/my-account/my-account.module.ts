import { AsyncPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import { allChildComponentImports } from '../../allChildComponentImports';
import {OptimisedImagePipe} from '../optimised-image.pipe';
import {MyAccountRoutingModule} from "./my-account-routing.module";
import {MyAccountComponent} from "./my-account.component";

@NgModule({
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    MyAccountRoutingModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    OptimisedImagePipe,
  ],
  declarations: [
    MyAccountComponent,
  ],
  providers: [
    DatePipe,
  ],
})
export class MyAccountModule {}
