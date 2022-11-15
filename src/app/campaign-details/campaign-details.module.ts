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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TimeLeftPipe } from '../time-left.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    CampaignDetailsCardComponent,
    CampaignDetailsRoutingModule,
    CurrencyPipe,
    DatePipe,
    FontAwesomeModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  providers: [
    CurrencyPipe,
    TimeLeftPipe, // Injected for TS use
  ],
  declarations: [CampaignDetailsComponent],
})
export class CampaignDetailsModule {}
