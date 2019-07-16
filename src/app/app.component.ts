import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public browserSupported: boolean;
  public title = 'donate-frontend';

  constructor() {
    this.browserSupported = 'time' in console; // True for IE11; false for e.g. IE10 down and some other super-old browsers
  }
}
