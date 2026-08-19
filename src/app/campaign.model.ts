import { HttpClient } from '@angular/common/http';
import { getHighlightedFeatures } from './regions';

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

  /**
   * General information about the campaign. Do not display directly - use formattedCampaignSummary instead.
   */
  summary: string;
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
  additionalImages: Array<{ altText: string; rank: number; uri: string }>;
  banner: null | { uri: string; alt_text: string | undefined };
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
    ryftAccountId?: string;
    psp?: null | 'stripe' | 'ryft';
    twitter?: string;
    website: string;
  };
  impactReporting: string | null;
  impactSummary: string | null;
  isMatched: boolean;
  locations: Array<{ countryName: string; regionCode: null } | { countryName: null; regionCode: string }>;
  problem: string | null;
  quotes: Array<{ person: string; quote: string }>;
  solution: string | null;
  // More on Campaign status semantics defined in Salesforce `docs/campaign-status-definitions`.
  status: 'Active' | 'Expired' | 'Preview' | null;
  updates: Array<{ content: string; modifiedDate: Date }>;
  alternativeFundUse?: string;
  championOptInStatement?: string;
  championRef?: string;
  parentRef?: string;
  surplusDonationInfo?: string;
  target?: number;
  thankYouMessage?: string;
  video?: { provider: string; key: string };
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

/**
 * Collapses sequences of line breaks in the campaign summary then returns a version of the summary with
 * each line break doubled to appear like a paragraph break.
 */
export function formattedCampaignSummary(campaign: Campaign): string {
  if (!campaign.summary) {
    return '';
  }

  return campaign.summary.replace(/\n{2,}/g, '\n').replace(/\n/g, '\n\n');
}

export function listImpactCountryNames(campaign: Campaign): string[] {
  const countryNames = campaign.locations
    .map((location) => location.countryName)
    .filter((name): name is string => !!name)
    .sort((a, b) => a.localeCompare(b));

  return [...new Set(countryNames)];
}

export async function listImpactRegionNames(campaign: Campaign, http: HttpClient): Promise<string[]> {
  const regionCodes = campaign.locations.map((loc) => loc.regionCode).filter((code): code is string => code !== null);

  const highlightAreas = await getHighlightedFeatures(regionCodes, http);

  const areaNames = highlightAreas
    .map((feature) => feature.properties && feature.properties['name'])
    .filter((name): name is string => !!name)
    .sort((a, b) => a.localeCompare(b));

  return [...new Set(areaNames)];
}
