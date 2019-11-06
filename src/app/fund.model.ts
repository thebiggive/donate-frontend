/**
 * Only Champion Fundings are used in the app thus far, not Pledges.
 */
export class Fund {
  constructor(
    /**
     * Unique ID for a fund assigned by the Big Give, in Salesforce case-insensitive format. 18 character string.
     */
    public id: string,
    public amountRaised: number,
    public description: string,
    public name: string,
    public totalAmount: number,
    public type: string,
    public logoUri: string,
    ) {}
}
