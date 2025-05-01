import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignDetailsComponent } from './campaign-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CampaignDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignDetailsRoutingModule {}
