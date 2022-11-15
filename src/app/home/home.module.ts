import { NgModule } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import { allChildComponentImports } from '../../allChildComponentImports';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PromotedCampaignsComponent } from '../promoted-campaigns/promoted-campaigns.component';

@NgModule({
  imports: [
    ...allChildComponentImports,
    FlexLayoutModule,
    HomeRoutingModule,
    PromotedCampaignsComponent,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
