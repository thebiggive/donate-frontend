enum DonationStatusEnum {
  'Cancelled',
  'Chargedback',
  'Collected',
  'Failed',
  'NotSet',
  'Pending',
  'Paid',
  'PendingCancellation',
  'Refunded',
  'RefundingPending',
  'Reserved', // TBG status set in Salesforce by Apex code, rather than by Charity Checkout hooks
}

// See https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-compile-time
export type DonationStatus = keyof typeof DonationStatusEnum;
