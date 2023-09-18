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
  minimumCreditAmount: number,
  maximumCreditAmount: number,
  postcodeLookupKey: string,
  postcodeLookupUri: string
  psps: {
    stripe: {
      publishableKey: string
    },
  },
  // https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
  recaptchaNonce: string,
  // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
  recaptchaIdentitySiteKey: string,
  reservationMinutes: number,
}
