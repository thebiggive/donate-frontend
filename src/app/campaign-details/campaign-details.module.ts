import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { allChildComponentImports } from '../../allChildComponentImports';
import { CampaignDetailsComponent } from './campaign-details.component';
import { CampaignDetailsRoutingModule } from './campaign-details-routing.module';
import { TimeLeftPipe } from '../time-left.pipe';
import { CampaignInfoComponent } from '../campaign-info/campaign-info.component';

@NgModule({
  imports: [
    ...allChildComponentImports,
    CampaignDetailsRoutingModule,
    CurrencyPipe,
    FontAwesomeModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    TimeLeftPipe,
  ],
  declarations: [CampaignDetailsComponent, CampaignInfoComponent],
  providers: [
    DatePipe,
  ],
})
export class CampaignDetailsModule {}
