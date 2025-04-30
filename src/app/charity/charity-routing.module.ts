import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharityComponent } from './charity.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CharityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharityRoutingModule {}
