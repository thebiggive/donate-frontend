import { Environment } from './environment.interface';
// // see also src/app/featureFlags.ts
export const environment: Environment = {
  friendlyCaptchaSiteKey: 'FCMIOJ2ARSHLBGAJ',
  environmentId: 'production',
  production: true,
  productionLike: true,
  creditTipsCampaign: 'a056900002LDXWgAAP',
  sfApiUriPrefix: 'https://sf-api-production.thebiggive.org.uk',
  creditDonationsEnabled: true, // Whether the donation start page offers credit for settlement. Credit purchase page is always available.
  donateUriPrefix: 'https://donate.biggive.org',
  experienceUriPrefix: 'https://community.biggive.org',
  blogUriPrefix: 'https://biggive.org',
  sharedCookieDomain: '.biggive.org',
  matchbotApiOrigin: 'https://matchbot-production.thebiggive.org.uk',
  matchbotApiPrefix: 'https://matchbot-production.thebiggive.org.uk/v1',
  getSiteControlId: '97792',
  identityApiPrefix: 'https://identity-production.thebiggive.org.uk/v1',
  matomoSiteId: 2,
  matomoNonZeroTipGoalId: 11,
  // Todo create test in Matomo
  matomoAbTest: {
    name: 'tip_slider_2025_oct',
    variantName: 'B',
    startDate: '2025/10/03 11:00:00 UTC',
    endDate: '2025/10/15 11:30:00 UTC',
  },
  minimumCreditAmount: 500,
  maximumCreditAmount: 500_000,
  postcodeLookupKey: 'gq9-k9zYakORdv2uoY_yVw33182',
  postcodeLookupUri: 'https://api.getAddress.io', // Full API base URI exc. trailing slash; undefined to switch off lookups.
  psps: {
    stripe: {
      enabled: true,
      publishableKey:
        'pk_live_51GxbdTKkGuKkxwBN1KsxsHMC8MrSeooSxBRETK6zoUYZSkKsjSLLryXE3vPIQm5jM6uV1Lsdvr9GoYB1dShkSELQ00xffCRBIi',
    },
  },
  reservationMinutes: 30,
  showDebugInfo: false,
};
