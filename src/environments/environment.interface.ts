export type EnvironmentID = 'development' | 'regression' | 'staging' | 'production';
// see also src/app/featureFlags.ts

/*
 * In 'YYYY/MM/DD HH:MM:SS UTC' format – can usually copy from 'Embed code' in Matomo UI view of test.
 *
 * note ${number} matches 1 OR MORE digits, so this isn't a foolproof format, but good enough to make it harder to make mistakes.
 */
type MatomoDate =
  `${number}${number}${number}${number}/${number}${number}/${number}${number} ${number}${number}:${number}${number}:${number}${number} UTC`;

export interface Environment {
  /* Site key is not secret and can be shared across environments. Not to be confused with secret key */
  friendlyCaptchaSiteKey: 'FCMIOJ2ARSHLBGAJ';
  environmentId: EnvironmentID;
  production: boolean;
  productionLike: boolean;
  creditTipsCampaign: string;
  apiUriPrefix: string;
  creditDonationsEnabled: boolean;

  /** Prefix for pages served by this Angular application */
  donateUriPrefix: string;

  /** Prefix for pages served by WordPress */
  blogUriPrefix: string;

  /** Domain for cookies to be shared between donate-frontend, wordpress etc.
   * Currently, ".biggive.org" in production.
   */
  sharedCookieDomain: string;

  /** Prefix for pages served by the SF Experience Cloud */
  experienceUriPrefix: string;
  donationsApiPrefix: string;
  getSiteControlId: string;
  identityApiPrefix: string;
  matomoSiteId: number | null;
  matomoNonZeroTipGoalId: number | null; // Only tracks GBP campaigns; sends tip as value in £.
  matomoAbTest?: {
    name: string;
    variantName: string; // The one that's not 'original'.
    startDate: MatomoDate;
    endDate?: MatomoDate; // Typically omit for dev/staging evaluation.
  };
  minimumCreditAmount: number;
  maximumCreditAmount: number;
  postcodeLookupKey: string;
  postcodeLookupUri: string;
  psps: {
    stripe: {
      enabled: boolean; // currently this is true in all envs, but typing as boolean in case we want to change it at short notice.
      publishableKey: string;
    };
  };
  reservationMinutes: number;
  showDebugInfo: boolean;
}
