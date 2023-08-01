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