export type Money = {
  "amountInPence": number,
  "currency": "GBP"
};

export interface Mandate {
  id: string,
  campaignId: string,
  charityName: string,
  status: 'active'|'pending',
  "schedule": {
    "type": "monthly",
    "dayOfMonth": number,
    "activeFrom": string,
    "expectedNextPaymentDate": string
  },
  numberOfMatchedDonations: number,
  giftAid: boolean,
  donationAmount: Money,
  matchedAmount: Money,
  giftAidAmount: Money,
  /** Includes main amount & GA but not matching */
  totalIncGiftAid: Money,

  /** Includes main amount & GA & matching of the first donation(s) */
  totalCharityReceivesPerInitial: Money,
}
