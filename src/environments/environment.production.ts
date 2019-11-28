export const environment = {
  production: true,
  apiUriPrefix: 'https://sf-api-production.thebiggive.org.uk',
  charityCheckoutInitUri: 'https://fundraise.charitycheckout.co.uk/api/checkout/init',
  donateUriPrefix: 'https://donate.thebiggive.org.uk',
  donationsApiPrefix: 'https://matchbot-production.thebiggive.org.uk/v1',
  googleAnalyticsId: 'UA-2979952-1',
  maximumDonationAmount: 25000,
  suggestedAmounts: [{weight: 1, values: [30, 100, 250]}, {weight: 9, values: []}], // Suggestions for 10% of donors, none for 90%
  thanksUriPrefix: 'https://donate.thebiggive.org.uk/thanks/',
};
