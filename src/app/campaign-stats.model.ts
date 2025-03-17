export class CampaignStats {
  constructor(
      /**
       * @param: all-time total amount raised (including adjustment) for all except master campaigns in pounds GBP
      */
      public totalRaised: number,
      /**
       * @param: count all non-master campaigns
       */
      public totalCampaignCount: number
  ) {}
}

export type FormattedCampaignStats = {
  totalRaisedFormatted: string,
  totalCountFormatted: string
};

export function formatCampaignStats(rawStats: CampaignStats): FormattedCampaignStats {
  const totalRaisedFormatted = "£" + Math.floor(rawStats.totalRaised).toLocaleString('en-GB');
  const totalCountFormatted = rawStats.totalCampaignCount.toLocaleString('en-GB');
  return {
      totalRaisedFormatted,
      totalCountFormatted
  };
}
