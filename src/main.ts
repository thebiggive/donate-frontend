import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // Used for some Angular Material components' touch support
import { defineCustomElement } from '@biggive/components-angular/lib/stencil-generated/angular-component-lib/utils';
import { DemoCampaignCards } from '@biggive/components-angular/lib/stencil-generated/components';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.productionLike) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
    // todo Edge polyfill? https://stenciljs.com/docs/angular#how-do-i-add-ie11-or-edge-support
  // defineCustomElement('demo-campaign-cards', DemoCampaignCards);
});

if (window) {
  // TODO remove proof of concept loading event log.
  window.addEventListener('appload', (event: any) => {
    console.log('Stencil did its thing: ' + event.detail.namespace);
  });
}
