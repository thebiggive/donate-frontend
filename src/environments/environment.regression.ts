// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts` unless a `--configuration` is also provided.
// The list of file replacements can be found in `angular.json`.

// The `regression` environment targets RegTest1 and is intended exclusively for automated regression testing.

export const environment = {
  production: false,
  apiUriPrefix: 'https://regtest1-biggive.cs105.force.com',
  charityCheckoutInitUri: 'https://fundraise.charitycheckouttest.co.uk/api/checkout/init',
  donateUriPrefix: 'https://donate-regression.thebiggivetest.org.uk',
  googleAnalyticsId: 'UA-2979952-3',
  maximumDonationAmount: 25000,
  thanksUriPrefix: 'https://donate-regression.thebiggivetest.org.uk/thanks/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
