import { NgModule } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import { allChildComponentImports } from '../../allChildComponentImports';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    ...allChildComponentImports,
    FlexLayoutModule,
    HomeRoutingModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
