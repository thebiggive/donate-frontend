import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { allChildComponentImports } from '../../allChildComponentImports';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { AsyncPipe } from '@angular/common';
import { HighlightCardsComponent } from '../highlight-cards/highlight-cards.component';

@NgModule({
  imports: [...allChildComponentImports, AsyncPipe, HomeRoutingModule, HighlightCardsComponent],
  declarations: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
