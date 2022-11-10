import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { ComponentsModule } from '@biggive/components-angular';

export const allChildComponentImports = [
  CommonModule,
  ComponentsModule,
  RouterLink,
  RouterLinkWithHref,
  RouterOutlet,
]
