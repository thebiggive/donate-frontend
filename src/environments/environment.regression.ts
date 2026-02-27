// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts` unless a `--configuration` is also provided.
// The list of file replacements can be found in `angular.json`.

// The `regression` environment targets RegTest1 and is intended exclusively for automated regression testing.

// see also src/app/featureFlags.ts

import { Environment } from './environment.interface';

export const environment: Environment = {
  friendlyCaptchaSiteKey: 'FCMIOJ2ARSHLBGAJ',
  environmentId: 'regression',
  production: false,
  productionLike: true,
  creditTipsCampaign: 'a053O00000J1ROLQA3',
  sfApiUriPrefix: 'https://sf-api-regression.thebiggivetest.org.uk',
  creditDonationsEnabled: true, // Whether the donation start page offers credit for settlement. Credit purchase page is always available.
  donateUriPrefix: 'https://donate-regression.thebiggivetest.org.uk',
  sharedCookieDomain: '.thebiggivetest.org.uk',
  blogUriPrefix: 'https://biggive.org',
  experienceUriPrefix: 'https://thebiggive--regtest1.sandbox.my.site.com',
  matchbotApiOrigin: 'https://matchbot-regression.thebiggivetest.org.uk',
  matchbotApiPrefix: 'https://matchbot-regression.thebiggivetest.org.uk/v1',
  getSiteControlId: '97792',
  identityApiPrefix: 'https://identity-regression.thebiggivetest.org.uk/v1',
  imageHosts: [
    'images-regression.thebiggivetest.org.uk',
    'images-staging.thebiggivetest.org.uk',
    'images-production.thebiggive.org.uk',
  ],
  matomoSiteId: 4,
  matomoNonZeroTipGoalId: null,
  minimumCreditAmount: 500,
  maximumCreditAmount: 500_000,
  psps: {
    stripe: {
      enabled: true,
      publishableKey:
        'pk_test_51GxbdTKkGuKkxwBNorvoPNKbbvEAwCjxfxOBd8lFZWAVkbJoXdFEDXOrbBbebAotP0vqLSntrLzs0Fvr7P7n0yjO00E3c61L5W',
    },
  },
  reservationMinutes: 25,
  showDebugInfo: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
