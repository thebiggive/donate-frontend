import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.productionLike) {
  enableProdMode();
}
console.log('in main.server.ts');

export { AppServerModule } from './app/app.server.module';
