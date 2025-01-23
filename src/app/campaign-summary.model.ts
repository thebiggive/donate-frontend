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
    endDate: Date,
    imageUri: string,
    isMatched: boolean,
    matchFundsRemaining: number,
    startDate: Date,
    status: string,
    target: number,
    title: string,
}
