export const environment = {
  production: true,
  apiUriPrefix: 'https://sf-api-production.thebiggive.org.uk',
  charityCheckoutInitUri: 'https://fundraise.charitycheckout.co.uk/api/checkout/init',
  donateUriPrefix: 'https://donate.thebiggive.org.uk',
  donationsApiPrefix: 'https://matchbot-production.thebiggive.org.uk/v1',
  facebookPixelId: '272508403759002',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-1',
  maximumDonationAmount: 25000,
  // Each of 4x suggestion sets for 5% of donors each, no suggestions for the other 80%.
  suggestedAmounts: [
    { weight: 1,  values: [30, 100, 250] },
    { weight: 1,  values: [50, 200, 500] },
    { weight: 1,  values: [20,  50, 100] },
    { weight: 1,  values: [20, 100, 500] },
    { weight: 16, values: [] },
  ],
  thanksUriPrefix: 'https://donate.thebiggive.org.uk/thanks/',
};
