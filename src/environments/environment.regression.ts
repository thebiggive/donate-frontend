// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts` unless a `--configuration` is also provided.
// The list of file replacements can be found in `angular.json`.

// The `regression` environment targets RegTest1 and is intended exclusively for automated regression testing.

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  productionLike: true,
  redirectHomepageToChirstmasChallenge: false,
  apiUriPrefix: 'https://regtest1-biggive.cs100.force.com',
  donateGlobalUriPrefix: 'https://donate-regression.thebiggivetest.org.uk',
  donateUriPrefix: 'https://donate-regression.thebiggivetest.org.uk',
  donationsApiPrefix: 'https://matchbot-regression.thebiggivetest.org.uk/v1',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-3',
  gg1FunderLogos: [
    'https://thebiggive--regtest1--c.visualforce.com/resource/1641902095000/imageGG1FunderExperian'
  ],
  maximumDonationAmount: 25000,
  postcodeLookupKey: 'gq9-k9zYakORdv2uoY_yVw33182',
  postcodeLookupUri: 'https://api.getAddress.io', // Full API base URI exc. trailing slash; undefined to switch off lookups.
  psps: {
    enthuse: {
      enabled: true,
      initUri: 'https://fundraise.charitycheckouttest.co.uk/api/checkout/init',
    },
    stripe: {
      enabled: true,
      prbEnabled: true, // Payment Request Buttons – Apple & Google Pay
      publishableKey: 'pk_test_51GxbdTKkGuKkxwBNorvoPNKbbvEAwCjxfxOBd8lFZWAVkbJoXdFEDXOrbBbebAotP0vqLSntrLzs0Fvr7P7n0yjO00E3c61L5W',
    },
  },
  reservationMinutes: 15,
  suggestedAmounts: {
    GBP: [
      { weight: 1, values: [] },
    ],
    USD: [
      { weight: 1, values: [] },
    ],
  },
  thanksUriPrefix: 'https://donate-regression.thebiggivetest.org.uk/thanks/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
