import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // Used for some Angular Material components' touch support
import { setAssetPath } from '@biggive/components/dist/components';
import { register } from 'swiper/element/bundle';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.productionLike) {
  enableProdMode();
}

setAssetPath(`${environment.donateGlobalUriPrefix}/assets`);

globalThis.document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
});

register();
