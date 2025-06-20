// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
// import './commands';

import { CampaignStats } from '../../src/app/campaign-stats.model';

Cypress.on('window:before:load', (win) => {
  // This is a workaround for a race condition in Cypress where the component library
  // initializes before Angular has a chance to set the asset path. By setting it here,
  // we ensure it's available at the earliest possible moment.
  // @ts-ignore
  win.__BIGGIVE_ASSET_PATH__ = `${Cypress.config('baseUrl')}/assets`;
});
