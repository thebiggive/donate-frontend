import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { environment } from './environments/environment';
import { setAssetPath } from '@biggive/components/dist/components';

if (environment.productionLike) {
  enableProdMode();
}

setAssetPath(`${environment.donateUriPrefix}/assets`);

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
