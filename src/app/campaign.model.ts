/**
 * @link https://app.swaggerhub.com/apis/Noel/TBG-Campaigns/#/Campaign
 */
export type CampaignOrMetaCampaign = {
  id: string;
  aims: string[];
  amountRaised: number;
  additionalImageUris: Array<{ uri: string; order: number }>;
  bannerUri: string;
  beneficiaries: string[];
  budgetDetails: Array<{ amount: number; description: string }>;
  categories: string[];
  championName: string;
  isRegularGiving: boolean | undefined;
  charity: {
    id: string;
    name: string;
    optInStatement: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    logoUri?: string;
    regulatorNumber: string;
    regulatorRegion: string;
    stripeAccountId?: string;
    twitter?: string;
    website: string;
  };
  countries: string[];
  currencyCode: 'GBP' | 'USD';
  donationCount: number;
  /**
   * ISO 8601 formatted datetime
   **/
  endDate: string;
  impactReporting: string | null;
  impactSummary: string | null;
  isMatched: boolean;

  /**
   * Total value of remaining match funds that may be used for this campaign in currency major units.
   * Is reduced when a donation is confirmed or pre-authorised for this campaign or one it shares funds with.
   */
  matchFundsRemaining: number;

  matchFundsTotal: number;
  problem: string | null;
  quotes: Array<{ person: string; quote: string }>;
  ready: boolean;
  solution: string | null;

  /**
   * ISO 8601 formatted datetime
   **/
  startDate: string;
  // More on Campaign status semantics defined in Salesforce `docs/campaign-status-definitions`.
  status: 'Active' | 'Expired' | 'Preview';
  summary: string;
  title: string;
  updates: Array<{ content: string; modifiedDate: Date }>;
  usesSharedFunds: boolean;
  alternativeFundUse?: string;
  campaignCount?: number;
  championOptInStatement?: string;
  championRef?: string;
  hidden: boolean;
  logoUri?: string;
  parentAmountRaised?: number;
  parentDonationCount?: number;
  parentRef?: string;
  parentTarget?: number;
  surplusDonationInfo?: string;
  target?: number;
  thankYouMessage?: string;
  video?: { provider: string; key: string };

  /**
   * List of errors encountered by the backend in rendering this campaign. Intended to help us catch any issues
   * that come up in MAT-405 work before release.
   * */
  errors?: string[];
} & (
  | {
      // If parentUsesSharedFunds then we expect the backend to tell us how much of those parental shared funds are available
      parentUsesSharedFunds: true;
      parentMatchFundsRemaining: number;
    }
  | {
      parentUsesSharedFunds: false;
    }
);

// for the moment MetaCampaign and Campaign are aliases of the same type as they are served together in the SF
// backend, but I'm intending to make them separate in matchbot and so move fields that are not common to the individual
// types below.

export type MetaCampaign = CampaignOrMetaCampaign;

/** AKA Charity Campaign */
export type Campaign = CampaignOrMetaCampaign;
