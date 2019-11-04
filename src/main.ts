import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import 'hammerjs'; // Used for Angular Material slide toggles' gesture support
// TODO bring back if using any inputs requiring touch support again.

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
});
