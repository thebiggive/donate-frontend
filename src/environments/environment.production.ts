export const environment = {
  production: true,
  apiUriPrefix: 'https://sf-api-production.thebiggive.org.uk',
  donateUriPrefix: 'https://donate.thebiggive.org.uk',
  donationsApiPrefix: 'https://matchbot-production.thebiggive.org.uk/v1',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-1',
  maximumDonationAmount: 25000,
  psps: {
    enthuse: {
      enabled: true,
      initUri: 'https://fundraise.charitycheckout.co.uk/api/checkout/init',
    },
    stripe: {
      enabled: false,
      publishableKey: 'TODO', // todo
    },
  },
  // One suggestion set for 30% of donors, no suggestions for the other 70%.
  suggestedAmounts: [
    { weight: 3, values: [50, 200, 500] },
    { weight: 7, values: [] },
  ],
  thanksUriPrefix: 'https://donate.thebiggive.org.uk/thanks/',
};
