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
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: 'tgpRzQu1tQMPXlyDgt1hoRK2GKw=',
  recaptchaSiteKey: '6LfmOwceAAAAAAYciCtwF6ZPQHJdvJZ5cqYqm1kk',
  reservationMinutes: 15,
  thanksUriPrefix: 'https://donate.thebiggive.org.uk/thanks/',
};
