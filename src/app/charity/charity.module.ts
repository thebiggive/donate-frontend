import { NgModule } from '@angular/core';

import { allChildComponentImports } from '../../allChildComponentImports';
import {CampaignCardComponent} from '../campaign-card/campaign-card.component';
import { CharityComponent } from './charity.component';
import {CharityRoutingModule} from './charity-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    ...allChildComponentImports,
    CampaignCardComponent,
    CharityRoutingModule,
    NoopAnimationsModule,
  ],
  declarations: [CharityComponent],
})
export class CharityModule {}
