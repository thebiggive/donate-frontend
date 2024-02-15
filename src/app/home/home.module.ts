import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { allChildComponentImports } from '../../allChildComponentImports';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { AsyncPipe } from '@angular/common';

@NgModule({
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    HomeRoutingModule,
  ],
  declarations: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
