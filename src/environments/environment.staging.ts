// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.production.ts` unless a `--configuration` is also provided.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUriPrefix: 'https://sf-api-staging.thebiggivetest.org.uk',
  ccStartTime: 1604934000, // 9th November, 15:00
  ccEndTime: 1604937600, // 9th November, 16:00
  donateUriPrefix: 'https://donate-staging.thebiggivetest.org.uk',
  donationsApiPrefix: 'https://matchbot-staging.thebiggivetest.org.uk/v1',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-3',
  maximumDonationAmount: 25000,
  psps: {
    enthuse: {
      enabled: true,
      initUri: 'https://fundraise.charitycheckouttest.co.uk/api/checkout/init',
    },
    stripe: {
      enabled: true,
      publishableKey: 'pk_test_51GxbdTKkGuKkxwBNorvoPNKbbvEAwCjxfxOBd8lFZWAVkbJoXdFEDXOrbBbebAotP0vqLSntrLzs0Fvr7P7n0yjO00E3c61L5W',
    },
  },
  redirectHomeToMeta: true,
  reservationMinutes: 15,
  // One suggestion set for 30% of donors, no suggestions for the other 70%.
  suggestedAmounts: [
    { weight: 3, values: [50, 200, 500] },
    { weight: 7, values: [] },
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
