import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  productionLike: true,
  apiUriPrefix: 'https://sf-api-production.thebiggive.org.uk',
  donateGlobalUriPrefix: 'https://thebiggive.com',
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
  reservationMinutes: 15,
  suggestedAmounts: {
    GBP: [
      // One suggestion set for 30% of donors, no suggestions for the other 70%.
      { weight: 3, values: [50, 200, 500] },
      { weight: 7, values: [] },
    ],
    USD: [
      { weight: 1, values: [70, 300, 700] },
    ],
  },
  thanksUriPrefix: 'https://donate.thebiggive.org.uk/thanks/',
};
