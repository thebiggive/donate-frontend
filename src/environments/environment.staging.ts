// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts` unless a `--configuration` is also provided.
// The list of file replacements can be found in `angular.json`.
//
// see also src/app/featureFlags.ts

import { Environment } from './environment.interface';

export const environment: Environment = {
  environmentId: 'staging',
  production: false,
  productionLike: true,
  creditTipsCampaign: 'a056900002LDXWgAAP',
  apiUriPrefix: 'https://sf-api-staging.thebiggivetest.org.uk',
  creditDonationsEnabled: true, // Whether the donation start page offers credit for settlement. Credit purchase page is always available.
  donateUriPrefix: 'https://donate-staging.thebiggivetest.org.uk',
  blogUriPrefix: 'https://wp-staging.thebiggivetest.org.uk',
  sharedCookieDomain: '.thebiggivetest.org.uk',
  experienceUriPrefix: 'https://thebiggive--full.sandbox.my.site.com',
  donationsApiPrefix: 'https://matchbot-staging.thebiggivetest.org.uk/v1',
  getSiteControlId: '97792',
  identityApiPrefix: 'https://identity-staging.thebiggivetest.org.uk/v1',
  matomoSiteId: 4,
  matomoNonZeroTipGoalId: 1,
  matomoAbTest: undefined,
  minimumCreditAmount: 500,
  maximumCreditAmount: 500_000,
  postcodeLookupKey: 'gq9-k9zYakORdv2uoY_yVw33182',
  postcodeLookupUri: 'https://api.getAddress.io', // Full API base URI exc. trailing slash; undefined to switch off lookups.
  psps: {
    stripe: {
      enabled: true,
      publishableKey: 'pk_test_51GxbdTKkGuKkxwBNorvoPNKbbvEAwCjxfxOBd8lFZWAVkbJoXdFEDXOrbBbebAotP0vqLSntrLzs0Fvr7P7n0yjO00E3c61L5W',
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: 'tgpRzQu1tQMPXlyDgt1hoRK2GKw=',
  recaptchaIdentitySiteKey: '6LfisFAgAAAAAOPEarzMPQ2gln_0Q-RENbD3bHzd',
  reservationMinutes: 30,
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
