interface SuggestedAmountSet {
  weight: number;
  values: number[];
}

// This helps e.g. `DonationService` understand the shape of the suggestions config.
export interface Environment {
  suggestedAmounts: {[currencyCode: string]: SuggestedAmountSet[] };
  [configKey: string]: any;
}
