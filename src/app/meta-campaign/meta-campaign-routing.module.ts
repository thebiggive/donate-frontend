import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetaCampaignComponent } from './meta-campaign.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MetaCampaignComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetaCampaignRoutingModule {}
