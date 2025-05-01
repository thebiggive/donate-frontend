import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { allChildComponentImports } from '../../allChildComponentImports';
import { CampaignDetailsComponent } from './campaign-details.component';
import { CampaignDetailsRoutingModule } from './campaign-details-routing.module';
import { CampaignInfoComponent } from '../campaign-info/campaign-info.component';
import { OptimisedImagePipe } from '../optimised-image.pipe';
import { TimeLeftPipe } from '../time-left.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    CampaignDetailsRoutingModule,
    CampaignInfoComponent,
    CurrencyPipe,
    FontAwesomeModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    OptimisedImagePipe,
    TimeLeftPipe,
  ],
  declarations: [CampaignDetailsComponent],
  providers: [DatePipe],
})
export class CampaignDetailsModule {}
