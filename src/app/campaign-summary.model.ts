export class CampaignSummary {
  constructor(
    public id: string,
    public amountRaised: number,
    public championName: string,
    public charity: {id: string, name: string},
    public imageUri: string,
    public isMatched: boolean,
    public target: number,
    public title: string,
    ) {}
}
