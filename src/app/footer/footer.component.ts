import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { allChildComponentImports } from '../../allChildComponentImports';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public now: number = Date.now();

  constructor() {}
}
