import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { allChildComponentImports } from '../../allChildComponentImports';

@Component({
  standalone: true,
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  imports: [
    ...allChildComponentImports,
    MatIconModule,
    MatListModule,
    MatMenuModule,
  ],
})
export class MainMenuComponent {
  @Input() listClass: 'bar' | 'tray';

  constructor() {
  }
}
