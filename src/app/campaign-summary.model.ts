export type CampaignSummary = {
  percentRaised?: number | string;
  isRegularGiving: boolean;
  id: string;
  amountRaised: number;
  parentRef: string | null;
  parentUsesSharedFunds: boolean;
  beneficiaries: string[];
  categories: string[];
  championName: string;
  charity: { id: string; name: string };
  currencyCode: string;

  /**
   * ISO 8601 formatted datetime
   **/
  endDate: string;
  imageUri: string;
  isMatched: boolean;
  matchFundsRemaining: number;

  /**
   * ISO 8601 formatted datetime
   **/
  startDate: string;
  status: string;
  target: number;
  title: string;
};

export type CampaignSummaryList = {
  campaignSummaries: CampaignSummary[];
};
