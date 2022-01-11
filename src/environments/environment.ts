// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  productionLike: false,
  redirectHomepageToChirstmasChallenge: false,
  apiUriPrefix: 'https://sf-api-staging.thebiggivetest.org.uk',
  donateGlobalUriPrefix: 'http://localhost:4200',
  donateUriPrefix: 'http://localhost:4200',
  donationsApiPrefix: 'http://localhost:30030/v1',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-3',
  googleOptimizeId: 'OPT-NV3NHD3',
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
      prbEnabled: false, // Payment Request Buttons – Apple & Google Pay. Unsupported without SSL.
      publishableKey: 'pk_test_51GxbdTKkGuKkxwBNorvoPNKbbvEAwCjxfxOBd8lFZWAVkbJoXdFEDXOrbBbebAotP0vqLSntrLzs0Fvr7P7n0yjO00E3c61L5W',
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
  recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  reservationMinutes: 15,
  suggestedAmounts: {
    GBP: [
      { weight: 1, values: [] },
    ],
    USD: [
      { weight: 1, values: [] },
    ],
  },
  thanksUriPrefix: 'http://localhost:4200/thanks/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
