import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // Used for some Angular Material components' touch support
import { setAssetPath } from '@biggive/components/dist/components';
import { register as registerSwiper } from 'swiper/element/bundle';

import { environment } from './environments/environment';
import {AppModule} from './app/app.module';

if (environment.productionLike) {
  enableProdMode();
}

setAssetPath(`${environment.donateUriPrefix}/assets`);

globalThis.document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});

registerSwiper();
