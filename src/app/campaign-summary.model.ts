export class CampaignSummary {
  public percentRaised: number|string;

  constructor(
    public id: string,
    public amountRaised: number,
    public beneficiaries: string[],
    public categories: string[],
    public championName: string,
    public charity: {id: string, name: string},
    public currencyCode: string,
    public endDate: Date,
    public imageUri: string,
    public isMatched: boolean,
    public matchFundsRemaining: number,
    public startDate: Date,
    public status: string,
    public target: number,
    public title: string,
  ) {}
}
