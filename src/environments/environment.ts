// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts`.
// The list of file replacements can be found in `angular.json`.

// see also src/app/featureFlags.ts

import { Environment } from './environment.interface';

export const environment: Environment = {
  friendlyCaptchaSiteKey: 'FCMIOJ2ARSHLBGAJ',
  environmentId: 'development',
  production: false,
  productionLike: false,
  creditTipsCampaign: '000000000000000003',
  sfApiUriPrefix: 'https://sf-api-staging.thebiggivetest.org.uk',
  creditDonationsEnabled: true, // Whether the donation start page offers credit for settlement. Credit purchase page is always available.
  donateEcsIntermediateHost: null,
  donateUriPrefix: 'http://localhost:4200',
  blogUriPrefix: 'http://localhost:30003',
  sharedCookieDomain: 'localhost',
  experienceUriPrefix: 'https://thebiggive--full.sandbox.my.site.com',
  matchbotApiOrigin: 'http://localhost:30030',
  matchbotApiPrefix: 'http://localhost:30030/v1',
  getSiteControlId: '97792',
  identityApiPrefix: 'http://localhost:30050/v1',
  imageHosts: [
    'images-regression.thebiggivetest.org.uk',
    'images-staging.thebiggivetest.org.uk',
    'images-production.thebiggive.org.uk',
    'picsum.photos',
  ],
  matomoSiteId: 4,
  matomoNonZeroTipGoalId: 1,
  matomoAbTest: {
    name: 'tip_slider_2025_ii',
    variantName: 'B',
    additionalVariantName: 'C',
    startDate: '2025/10/29 07:00:00 UTC',
    endDate: undefined,
  },
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
  showDebugInfo: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
