export const environment = {
  production: true,
  productionLike: true,
  apiUriPrefix: 'https://sf-api-production.thebiggive.org.uk',
  ccStartTime: 1606824000, // 1st December 2020, 12:00pm
  ccEndTime: 1607428800, // 8th December 2020, 12:00pm
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
      enabled: true,
      publishableKey: 'pk_live_51GxbdTKkGuKkxwBN1KsxsHMC8MrSeooSxBRETK6zoUYZSkKsjSLLryXE3vPIQm5jM6uV1Lsdvr9GoYB1dShkSELQ00xffCRBIi',
    },
  },
  redirectHomeToMeta: true,
  reservationMinutes: 15,
  // One suggestion set for 30% of donors, no suggestions for the other 70%.
  suggestedAmounts: [
    { weight: 3, values: [50, 200, 500] },
    { weight: 7, values: [] },
  ],
  thanksUriPrefix: 'https://donate.thebiggive.org.uk/thanks/',
};
