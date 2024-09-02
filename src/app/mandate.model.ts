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
  giftAid: boolean,
  "amount": {
    "amountInPence": number,
    "currency": "GBP"
  },
}
