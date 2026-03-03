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
  donateEcsIntermediateHost: 'donate-ecs-production.thebiggive.org.uk',
  donateUriPrefix: 'https://donate.biggive.org',
  experienceUriPrefix: 'https://community.biggive.org',
  blogUriPrefix: 'https://biggive.org',
  sharedCookieDomain: '.biggive.org',
  matchbotApiOrigin: 'https://matchbot-production.thebiggive.org.uk',
  matchbotApiPrefix: 'https://matchbot-production.thebiggive.org.uk/v1',
  getSiteControlId: '97792',
  identityApiPrefix: 'https://identity-production.thebiggive.org.uk/v1',
  imageHosts: ['images-production.thebiggive.org.uk'],
  matomoSiteId: 2,
  matomoNonZeroTipGoalId: 11,
  matomoAbTest: {
    name: 'tip_slider_2025_12_ii',
    variantName: 'B',
    startDate: '2025/12/04 13:00:00 UTC',
    endDate: '2025/12/09 13:00:00 UTC',
  },
  minimumCreditAmount: 500,
  maximumCreditAmount: 500_000,
  psps: {
    stripe: {
      enabled: true,
      publishableKey:
        'pk_live_51GxbdTKkGuKkxwBN1KsxsHMC8MrSeooSxBRETK6zoUYZSkKsjSLLryXE3vPIQm5jM6uV1Lsdvr9GoYB1dShkSELQ00xffCRBIi',
    },
  },
  reservationMinutes: 25,
  showDebugInfo: false,
};
