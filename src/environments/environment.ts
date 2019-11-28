// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUriPrefix: 'https://sf-api-staging.thebiggivetest.org.uk',
  charityCheckoutInitUri: 'https://fundraise.charitycheckouttest.co.uk/api/checkout/init',
  donateUriPrefix: 'http://localhost:4200',
  donationsApiPrefix: 'http://localhost:30030/v1',
  googleAnalyticsId: 'UA-2979952-3',
  maximumDonationAmount: 25000,
  suggestedAmounts: [{weight: 1, values: [30, 100, 250]}, {weight: 4, values: [10, 20, 30]}],
  thanksUriPrefix: 'http://localhost:4200/thanks/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
