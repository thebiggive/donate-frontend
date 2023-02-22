import { Environment } from './environment.interface';

export const environment: Environment = {
  environmentId: "production",
  production: true,
  productionLike: true,
  redirectHomepageToChirstmasChallenge: false,
  creditTipsCampaign: 'a056900002LDXWgAAP',
  apiUriPrefix: 'https://sf-api-production.thebiggive.org.uk',
  creditDonationsEnabled: true, // Whether the donation start page offers credit for settlement. Credit purchase page is always available.
  donateGlobalUriPrefix: 'https://donate.biggive.org',
  donateUriPrefix: 'https://donate.thebiggive.org.uk',
  donationsApiPrefix: 'https://matchbot-production.thebiggive.org.uk/v1',
  getSiteControlId: '97792',
  googleAnalyticsId: 'UA-2979952-1',
  googleOptimizeId: null,
  // googleOptimizeId: 'OPT-W78W6BT', // Bring back when we have an experiment to run
  identityApiPrefix: 'https://identity-production.thebiggive.org.uk/v1',
  identityEnabled: true,
  maximumDonationAmount: 25000,
  minimumCreditAmount: 500,
  maximumCreditAmount: 25000,
  postcodeLookupKey: 'gq9-k9zYakORdv2uoY_yVw33182',
  postcodeLookupUri: 'https://api.getAddress.io', // Full API base URI exc. trailing slash; undefined to switch off lookups.
  psps: {
    stripe: {
      enabled: true,
      prbEnabled: true, // Payment Request Buttons – Apple & Google Pay
      publishableKey: 'pk_live_51GxbdTKkGuKkxwBN1KsxsHMC8MrSeooSxBRETK6zoUYZSkKsjSLLryXE3vPIQm5jM6uV1Lsdvr9GoYB1dShkSELQ00xffCRBIi',
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: 'tgpRzQu1tQMPXlyDgt1hoRK2GKw=',
  recaptchaSiteKey: '6LfmOwceAAAAAAYciCtwF6ZPQHJdvJZ5cqYqm1kk',
  recaptchaIdentitySiteKey: '6Lc9uFAgAAAAADPHW12p_oJ3QxcNA3xglajo5hl2',
  reservationMinutes: 30,
};
