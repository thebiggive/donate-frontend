// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  productionLike: false,
  redirectHomepageToChirstmasChallenge: false,
  creditTipsCampaign: 'a053O00000J1ROLQA3',
  apiUriPrefix: 'https://sf-api-staging.thebiggivetest.org.uk',
  creditDonationsEnabled: true, // Whether the donation start page offers credit for settlement. Credit purchase page is always available.
  donateGlobalUriPrefix: 'http://localhost:4200',
  donateUriPrefix: 'http://localhost:4200',
  donationsApiPrefix: 'http://localhost:30030/v1',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-3',
  googleOptimizeId: null,
  // googleOptimizeId: 'OPT-NV3NHD3', // Bring back when we have an experiment to run
  identityApiPrefix: 'http://localhost:30050/v1',
  identityEnabled: true,
  maximumDonationAmount: 25000,
  minimumCreditAmount: 500,
  maximumCreditAmount: 25000,
  postcodeLookupKey: 'gq9-k9zYakORdv2uoY_yVw33182',
  postcodeLookupUri: 'https://api.getAddress.io', // Full API base URI exc. trailing slash; undefined to switch off lookups.
  promotedMetacampaign1Slug: 'Pakistan-Floods-Appeal-2022',
  promotedMetacampaign2Slug: 'mental-health-match-fund-2022',
  psps: {
    stripe: {
      enabled: true,
      prbEnabled: false, // Payment Request Buttons – Apple & Google Pay. Unsupported without SSL.
      publishableKey: 'pk_test_51GxbdTKkGuKkxwBNorvoPNKbbvEAwCjxfxOBd8lFZWAVkbJoXdFEDXOrbBbebAotP0vqLSntrLzs0Fvr7P7n0yjO00E3c61L5W',
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: 'tgpRzQu1tQMPXlyDgt1hoRK2GKw=',
  // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
  recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  recaptchaIdentitySiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  reservationMinutes: 15,
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
