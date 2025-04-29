export type CampaignStats = {
    /**
     * all-time total amount raised (including adjustment) for all except master campaigns in pounds GBP
    */
    totalRaised: number,

    /**
     * count all non-master campaigns
     */
    totalCampaignCount: number
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
