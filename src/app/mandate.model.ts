
export interface Mandate {
  id: string,
  campaignId: string,
  charityName: string,
  "schedule": {
    "type": "monthly",
    "dayOfMonth": number,
    "activeFrom": string
  },
  "amount": {
    "amountInPence": number,
    "currency": "GBP"
  },

  /** TEMPORARILY HARD CODED OBJECT RETURNED FROM MATCHBOT
   * {
   *  "mandates": [
   *    {
   *      "id": "e552a93e-540e-11ef-98b2-3b7275661822",
   *      "donorId": "1ef4a9a8-de15-66d2-b013-b1e1f8ab704d",
   *      "amount": {
   *        "amountInPence": 500000,
   *        "currency": "GBP"
   *      },
   *      "campaignId": "DummySFIDCampaign0",
   *      "charityId": "DummySFIDCharity00",
   *      "schedule": {
   *        "type": "monthly",
   *        "dayOfMonth": 31,
   *        "activeFrom": "2024-08-06T00:00:00+00:00"
   *      },
   *      "charityName": "Some Charity",
   *      "createdTime": "2024-08-06T00:00:00+00:00",
   *      "giftAid": true,
   *      "status": "active",
   *      "tipAmount": {
   *        "amountInPence": 100,
   *        "currency": "GBP"
   *      },
   *      "updatedTime": "2024-08-06T00:00:00+00:00"
   *    }
   *  ]
   * }
   */
}
