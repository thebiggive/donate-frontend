import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.productionLike) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';

export { renderModule, renderModuleFactory } from '@angular/platform-server';