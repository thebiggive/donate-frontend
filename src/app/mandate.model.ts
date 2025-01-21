export interface Mandate {
  id: string,
  campaignId: string,
  charityName: string,
  status: 'active'|'pending',
  // @todo-regular-giving-DON-1008 : we might want to keep the total donated amount as part of the regular giving mandate
  // giftAidAmount: number = 0;
  "schedule": {
    "type": "monthly",
    "dayOfMonth": number,
    "activeFrom": string,
    "expectedNextPaymentDate": string
  },
  numberOfMatchedDonations: number,
  giftAid: boolean,
  donationAmount: {
    "amountInPence": number,
    "currency": "GBP"
  },
  matchedAmount: {
    "amountInPence": number,
    "currency": "GBP"
  }
}
