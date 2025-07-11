/**
 * @link https://app.swaggerhub.com/apis/Noel/TBG-Campaigns/#/Campaign
 *
 * Represents a grouped campaign run by BG to raise funds for one or many charities, e.g. Christmas Challenge,
 * Earth Raise, or an emergency campaign. Does not directly accept donations. Distinct from Charity Campaign
 * aka simply `campaign`, which has its own model.
 */
export type MetaCampaign = {
  id: string;
  title: string;
  currencyCode: 'GBP' | 'USD';
  status: 'Active' | 'Expired' | 'Preview' | null;
  hidden: boolean;
  ready: boolean;
  summary: string;
  bannerUri: string;
  amountRaised: number;

  /**
   * Total value of remaining match funds that may be used for this campaign in currency major units.
   * Is reduced when a donation is confirmed or pre-authorised for any associated charity campaign
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

  /**
   * How many charity campaigns are associated with this metacampaign?
   *
   * Only marked optional because it was previously defined for a common campaign / metacampaign model
   */
  campaignCount?: number;
  usesSharedFunds: boolean;

  /** Whether to apply the new banner layout. Treat undefined as false. */
  useDon1120Banner?: boolean;
};
