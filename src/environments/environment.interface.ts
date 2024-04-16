export type EnvironmentID ='development'|'regression'|'staging'|'production';

// see also src/app/featureFlags.ts

export interface Environment {
  environmentId: EnvironmentID,
  production: boolean,
  productionLike: boolean,
  creditTipsCampaign: string,
  apiUriPrefix: string
  creditDonationsEnabled: boolean

  /** Prefix for pages served by this Angular application */
  donateGlobalUriPrefix: string,
  donateUriPrefix: string, // Uses legacy host for redirects

  /** Prefix for pages served by WordPress */
  blogUriPrefix: string,

  /** Domain for cookies to be shared between donate-frontend, wordpress etc.
   * Currently, ".biggive.org" in production.
   */
  sharedCookieDomain: string;

  /** Prefix for pages served by the SF Experience Cloud */
  experienceUriPrefix: string,
  donationsApiPrefix: string,
  getSiteControlId: string,
  identityApiPrefix: string,
  matomoSiteId: number | null, // null for no Matomo tracking.
  matomoNonZeroTipGoalId: number | null, // Only tracks GBP campaigns; sends tip as value in £.
  matomoAbTest?: {
    name: string,
    variantName: string, // The one that's not 'original'.
    startDate: string, // In 'YYYY/MM/DD HH:MM:SS UTC' format – can usually copy from 'Embed code' in Matomo UI view of test.
    endDate?: string, // Typically omit for dev/staging evaluation.
  },
  minimumCreditAmount: number,
  maximumCreditAmount: number,
  postcodeLookupKey: string,
  postcodeLookupUri: string
  psps: {
    stripe: {
      enabled: boolean; // currently this is true in all envs, but typing as boolean in case we want to change it at short notice.
      publishableKey: string
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: string,
  // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
  recaptchaIdentitySiteKey: string,
  reservationMinutes: number,
  showDebugInfo: boolean,
}
