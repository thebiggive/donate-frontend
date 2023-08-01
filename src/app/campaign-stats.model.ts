export class CampaignStats {
    constructor(
        /**
         * @param: total amount raised (including adjustment) for all except master campaigns
        */
        public totalRaisedWithAdjustment: number,
        /**
         * @param: total count of all non-master campaigns
         */
        public totalCampaignCount: number
    ) {}
  }