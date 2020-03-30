// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts` unless a `--configuration` is also provided.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUriPrefix: 'https://sf-api-staging.thebiggivetest.org.uk',
  charityCheckoutInitUri: 'https://fundraise.charitycheckouttest.co.uk/api/checkout/init',
  donateUriPrefix: 'https://donate-staging.thebiggivetest.org.uk',
  donationsApiPrefix: 'https://matchbot-staging.thebiggivetest.org.uk/v1',
  facebookPixelId: '272508403759002',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-3',
  maximumDonationAmount: 25000,
  // Each of 4x suggestion sets for 5% of donors each, no suggestions for the other 80%.
  suggestedAmounts: [
    { weight: 1,  values: [30, 100, 250] },
    { weight: 1,  values: [50, 200, 500] },
    { weight: 1,  values: [20,  50, 100] },
    { weight: 1,  values: [20, 100, 500] },
    { weight: 16, values: [] },
  ],
  thanksUriPrefix: 'https://donate-staging.thebiggivetest.org.uk/thanks/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
