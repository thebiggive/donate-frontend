// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts` unless a `--configuration` is also provided.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  productionLike: true,
  redirectHomepageToChirstmasChallenge: false,
  apiUriPrefix: 'https://sf-api-staging.thebiggivetest.org.uk',
  donateGlobalUriPrefix: 'https://donate-staging.thebiggivetest.org.uk',
  donateUriPrefix: 'https://donate-staging.thebiggivetest.org.uk',
  donationsApiPrefix: 'https://matchbot-staging.thebiggivetest.org.uk/v1',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-3',
  googleOptimizeId: null,
  //googleOptimizeId: 'OPT-NV3NHD3', // Bring back when we have an experiment to run
  identityApiPrefix: 'https://identity-staging.thebiggivetest.org.uk/v1',
  identityEnabled: true,
  maximumDonationAmount: 25000,
  postcodeLookupKey: 'gq9-k9zYakORdv2uoY_yVw33182',
  postcodeLookupUri: 'https://api.getAddress.io', // Full API base URI exc. trailing slash; undefined to switch off lookups.
  promotedMetacampaign1Slug: 'women-and-girls-match-fund-2022',
  promotedMetacampaign2Slug: 'mental-health-match-fund-2022',
  psps: {
    stripe: {
      enabled: true,
      prbEnabled: true, // Payment Request Buttons – Apple & Google Pay
      publishableKey: 'pk_test_51GxbdTKkGuKkxwBNorvoPNKbbvEAwCjxfxOBd8lFZWAVkbJoXdFEDXOrbBbebAotP0vqLSntrLzs0Fvr7P7n0yjO00E3c61L5W',
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: 'tgpRzQu1tQMPXlyDgt1hoRK2GKw=',
  recaptchaSiteKey: '6LfJPAceAAAAAPnbqSG-lMNCiawYsTrT_daIW6sq',
  recaptchaIdentitySiteKey: '6LfisFAgAAAAAOPEarzMPQ2gln_0Q-RENbD3bHzd',
  reservationMinutes: 15,
  thanksUriPrefix: 'https://donate-staging.thebiggivetest.org.uk/thanks/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
