/**
 * @link https://app.swaggerhub.com/apis/Noel/TBG-Campaigns/#/Campaign
 *
 * Represents an individual campaign to raise funds for one charity - distinct from a metacampaign
 * which has its own model
 */
export type Campaign = {
  id: string;
  title: string;
  currencyCode: 'GBP' | 'USD';
  hidden: boolean;
  ready: boolean;
  summary: string;
  bannerUri: string;
  amountRaised: number;
  /**
   * Total value of remaining match funds that may be used for this campaign in currency major units.
   * Is reduced when a donation is confirmed or pre-authorised for this campaign or one it shares funds with.
   */
  matchFundsRemaining: number;
  donationCount: number;
  /**
   * ISO 8601 formatted datetime
   **/
  startDate: string;
  /**
   * ISO 8601 formatted datetime
   **/
  endDate: string;
  matchFundsTotal: number;
  aims: string[];
  additionalImageUris: Array<{ uri: string; order: number }>;
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
  impactReporting: string | null;
  impactSummary: string | null;
  isMatched: boolean;
  problem: string | null;
  quotes: Array<{ person: string; quote: string }>;
  solution: string | null;
  // More on Campaign status semantics defined in Salesforce `docs/campaign-status-definitions`.
  status: 'Active' | 'Expired' | 'Preview' | null;
  updates: Array<{ content: string; modifiedDate: Date }>;
  alternativeFundUse?: string;
  championOptInStatement?: string;
  championRef?: string;
  logoUri?: string;
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
      parentDonationCount: number;
      parentMatchFundsRemaining: number;
      parentAmountRaised?: number;
    }
  | {
      parentUsesSharedFunds: false;
    }
);
