export type CampaignSummary = {
    percentRaised?: number|string;
    isRegularGiving: boolean;
    id: string,
    amountRaised: number,
    beneficiaries: string[],
    categories: string[],
    championName: string,
    charity: {id: string, name: string},
    currencyCode: string,

  /**
   * Note type declared is wrong in some or all cases - may be a string e.g. `2025-01-29T12:30:00.000Z` not date Object.
   **/
    endDate: Date,
    imageUri: string,
    isMatched: boolean,
    matchFundsRemaining: number,

  /**
   * Note type declared is wrong in some or all cases - may be a string e.g. `2025-01-29T12:30:00.000Z` not date Object.
   **/
    startDate: Date,
    status: string,
    target: number,
    title: string,
}
