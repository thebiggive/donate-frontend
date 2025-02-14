import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // Used for some Angular Material components' touch support
import { setAssetPath } from '@biggive/components/dist/components';
import { register } from 'swiper/element/bundle';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// if (environment.productionLike) {
//   enableProdMode();
// }

setAssetPath(`${environment.donateUriPrefix}/assets`);

console.log('in main.ts before dom thing');

globalThis.document.addEventListener('DOMContentLoaded', () => {
  console.log('may attempt browser bootstrap');

  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  console.log('did attempt browser bootstrap');
});

register();

console.log('end of main.ts');
