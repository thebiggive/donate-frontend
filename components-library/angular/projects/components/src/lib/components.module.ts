import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DIRECTIVES } from './stencil-generated';

@NgModule({
  imports: [CommonModule],
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
})
export class ComponentsModule { }
