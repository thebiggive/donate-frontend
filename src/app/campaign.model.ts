/**
 * @link https://app.swaggerhub.com/apis/Noel/TBG-Campaigns/#/Campaign
 */
export class Campaign {
  constructor(
    public id: string,
    public aims: string[],
    public amountRaised: number,
    public additionalImageUris: Array<{uri: string, order: number}>,
    public bannerUri: string,
    public beneficiaries: string[],
    public budgetDetails: Array<{amount: number, description: string}>,
    public categories: string[],
    public championName: string,
    public charity: {
      id: string,
      name: string,
      optInStatement: string,
      facebook?: string,
      instagram?: string,
      linkedin?: string,
      logoUri?: string,
      regulatorNumber: string,
      regulatorRegion: string,
      stripeAccountId?: string,
      twitter?: string,
      website: string,
    },
    public countries: string[],
    public currencyCode: 'GBP' | 'USD',
    public donationCount: number,
    public endDate: Date,
    public impactReporting: string,
    public impactSummary: string,
    public isMatched: boolean,
    public matchFundsRemaining: number,
    public matchFundsTotal: number,
    public parentUsesSharedFunds: boolean,
    public problem: string,
    public quotes: Array<{person: string, quote: string}>,
    public ready: boolean,
    public solution: string,
    public startDate: Date,
    public status: 'Active' | 'Expired' | 'Preview' | 'Pending',
    public summary: string = '',
    public title: string,
    public updates: Array<{content: string, modifiedDate: Date}>,
    public usesSharedFunds: boolean,
    public alternativeFundUse?: string,
    public campaignCount?: number,
    public championOptInStatement?: string,
    public championRef?: string,
    public hidden = false,
    public logoUri?: string,
    public parentAmountRaised?: number,
    public parentDonationCount?: number,
    public parentRef?: string,
    public parentTarget?: number,
    public surplusDonationInfo?: string,
    public target?: number,
    public thankYouMessage?: string,
    public video?: {provider: string, key: string},
  ) {}
}

export function campaignDurationInDays(campaign: Campaign) {
  return Math.floor((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / 86400000);
}
