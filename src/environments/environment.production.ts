import { Environment } from './environment.interface';
// // see also src/app/featureFlags.ts
export const environment: Environment = {
  environmentId: "production",
  production: true,
  productionLike: true,
  creditTipsCampaign: 'a056900002LDXWgAAP',
  apiUriPrefix: 'https://sf-api-production.thebiggive.org.uk',
  creditDonationsEnabled: true, // Whether the donation start page offers credit for settlement. Credit purchase page is always available.
  donateGlobalUriPrefix: 'https://donate.biggive.org',
  donateUriPrefix: 'https://donate.thebiggive.org.uk',
  experienceUriPrefix: 'https://community.biggive.org',
  blogUriPrefix: 'https://biggive.org',
  sharedCookieDomain: ".biggive.org",
  donationsApiPrefix: 'https://matchbot-production.thebiggive.org.uk/v1',
  getSiteControlId: '97792',
  identityApiPrefix: 'https://identity-production.thebiggive.org.uk/v1',
  matomoSiteId: 2,
  matomoNonZeroTipGoalId: 11,
  matomoAbTest: {
    name: "GmfTipCopy2024",
    variantName: "B",
    startDate: '2024/04/18 11:00:00 UTC',
    endDate: undefined,
  },
  minimumCreditAmount: 500,
  maximumCreditAmount: 500_000,
  postcodeLookupKey: 'gq9-k9zYakORdv2uoY_yVw33182',
  postcodeLookupUri: 'https://api.getAddress.io', // Full API base URI exc. trailing slash; undefined to switch off lookups.
  psps: {
    stripe: {
      enabled: true,
      publishableKey: 'pk_live_51GxbdTKkGuKkxwBN1KsxsHMC8MrSeooSxBRETK6zoUYZSkKsjSLLryXE3vPIQm5jM6uV1Lsdvr9GoYB1dShkSELQ00xffCRBIi',
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: 'tgpRzQu1tQMPXlyDgt1hoRK2GKw=',
  recaptchaIdentitySiteKey: '6Lc9uFAgAAAAADPHW12p_oJ3QxcNA3xglajo5hl2',
  reservationMinutes: 30,
  showDebugInfo: false,
};
