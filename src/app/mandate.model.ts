export interface Mandate {
  id: string,
  campaignId: string,
  charityName: string,
  status: 'active'|'pending',
  // @todo-regular-giving : we might want to keep the total donated amount as part of the regular giving mandate
  // giftAidAmount: number = 0;
  "schedule": {
    "type": "monthly",
    "dayOfMonth": number,
    "activeFrom": string,
    "expectedNextPaymentDate": string
  },
  /**
   * @todo-regular-giving: this property doesn't exist in matchbot yet
   */
  numberOfMatchedDonations: number,
  giftAid: boolean,
  /**
   * @todo-regular-giving: this property needs renaming in matchbot
   */
  donationAmount: {
    "amountInPence": number,
    "currency": "GBP"
  },
  /**
   * @todo-regular-giving: this property doesn't exist in matchbot yet
   */
  matchedAmount: {
    "amountInPence": number,
    "currency": "GBP"
  }
}
