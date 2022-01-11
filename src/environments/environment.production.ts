import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  productionLike: true,
  redirectHomepageToChirstmasChallenge: false,
  apiUriPrefix: 'https://sf-api-production.thebiggive.org.uk',
  donateGlobalUriPrefix: 'https://thebiggive.com',
  donateUriPrefix: 'https://donate.thebiggive.org.uk',
  donationsApiPrefix: 'https://matchbot-production.thebiggive.org.uk/v1',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-1',
  googleOptimizeId: 'OPT-W78W6BT',
  gg1FunderLogos: [
    'https://thebiggive--c.visualforce.com/resource/1641902289000/imageGG1FunderExperian'
  ],
  maximumDonationAmount: 25000,
  postcodeLookupKey: 'gq9-k9zYakORdv2uoY_yVw33182',
  postcodeLookupUri: 'https://api.getAddress.io', // Full API base URI exc. trailing slash; undefined to switch off lookups.
  psps: {
    enthuse: {
      enabled: true,
      initUri: 'https://fundraise.charitycheckout.co.uk/api/checkout/init',
    },
    stripe: {
      enabled: true,
      prbEnabled: true, // Payment Request Buttons – Apple & Google Pay
      publishableKey: 'pk_live_51GxbdTKkGuKkxwBN1KsxsHMC8MrSeooSxBRETK6zoUYZSkKsjSLLryXE3vPIQm5jM6uV1Lsdvr9GoYB1dShkSELQ00xffCRBIi',
    },
  },
  reservationMinutes: 15,
  // As agreed 23 Nov '21, no amount suggestions for CC21 / while we explore Optimize
  // tip amount copy experiments.
  suggestedAmounts: {
    GBP: [
      { weight: 1, values: [] },
    ],
    USD: [
      { weight: 1, values: [] },
    ],
  },
  thanksUriPrefix: 'https://donate.thebiggive.org.uk/thanks/',
};
