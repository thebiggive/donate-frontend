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
}

// See https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-compile-time
export type DonationStatus = keyof typeof DonationStatusEnum;
