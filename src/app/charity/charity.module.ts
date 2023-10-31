import { NgModule } from '@angular/core';

import { allChildComponentImports } from '../../allChildComponentImports';
import { CharityComponent } from './charity.component';
import {CharityRoutingModule} from './charity-routing.module';
import { OptimisedImagePipe } from '../optimised-image.pipe';

@NgModule({
  imports: [
    ...allChildComponentImports,
    CharityRoutingModule,
    OptimisedImagePipe,
  ],
  declarations: [CharityComponent],
})
export class CharityModule {}
