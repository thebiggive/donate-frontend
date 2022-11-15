import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { allChildComponentImports } from '../../allChildComponentImports';
import { CampaignDetailsComponent } from './campaign-details.component';
import { CampaignDetailsRoutingModule } from './campaign-details-routing.module';
import { CampaignDetailsCardComponent } from '../campaign-details-card/campaign-details-card.component';

@NgModule({
  imports: [
    ...allChildComponentImports,
    CampaignDetailsCardComponent,
    CampaignDetailsRoutingModule,
    CurrencyPipe,
    DatePipe,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  declarations: [CampaignDetailsComponent],
})
export class CampaignDetailsModule {}
