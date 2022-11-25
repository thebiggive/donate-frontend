import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyCreditsComponent } from './buy-credits.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: BuyCreditsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyCreditsRoutingModule {}
