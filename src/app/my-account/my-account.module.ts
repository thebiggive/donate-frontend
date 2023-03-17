import { AsyncPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import { allChildComponentImports } from '../../allChildComponentImports';
import {OptimisedImagePipe} from '../optimised-image.pipe';
import {MyAccountRoutingModule} from "./my-account-routing.module";
import {MyAccountComponent} from "./my-account.component";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";

@NgModule({
    imports: [
        ...allChildComponentImports,
        AsyncPipe,
        MyAccountRoutingModule,
        InfiniteScrollModule,
        MatProgressSpinnerModule,
        OptimisedImagePipe,
        MatButtonModule,
    ],
  declarations: [
    MyAccountComponent,
  ],
  providers: [
    DatePipe,
  ],
})
export class MyAccountModule {}
