import { NgModule } from '@angular/core';

import { allChildComponentImports } from '../../allChildComponentImports';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    ...allChildComponentImports,
    HomeRoutingModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
