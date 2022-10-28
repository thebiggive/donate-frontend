import { Component } from '@angular/core';

import { allChildComponentImports } from '../../allChildComponentImports';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [
    ...allChildComponentImports,
  ],
})
export class FooterComponent {
  public now: number = Date.now();

  constructor() {}
}
