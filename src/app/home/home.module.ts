import { NgModule } from '@angular/core';

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
})
export class HomeModule {}
