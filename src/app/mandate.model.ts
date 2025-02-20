export type Money = {
  "amountInPence": number,
  "currency": "GBP"
};

export type Mandate = {
  id: string,
  campaignId: string,
  charityName: string,
  status: 'active'|'pending'|'cancelled',
  "schedule": {
    "type": "monthly",
    "dayOfMonth": number,
    "activeFrom": string,
    "expectedNextPaymentDate": string
  },
  giftAid: boolean,
  donationAmount: Money,
  matchedAmount: Money,
  giftAidAmount: Money,
  /** Includes main amount & GA but not matching */
  totalIncGiftAid: Money,
} & ({
  isMatched: true;
  /** Includes main amount & GA & matching of the first donation(s) */
  totalCharityReceivesPerInitial: Money,
  numberOfMatchedDonations: number,
} | {
  isMatched: false;
  numberOfMatchedDonations: 0,
}
)
