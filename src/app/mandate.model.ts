export interface Mandate {
  id: string,
  campaignId: string,
  charityName: string,
  status: 'active'|'pending'
  "schedule": {
    "type": "monthly",
    "dayOfMonth": number,
    "activeFrom": string,
    "expectedNextPaymentDate": string
  },
  numberOfMatchedDonations: string,
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
