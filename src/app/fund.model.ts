/**
 * Only Champion Fundings are used in the app thus far, not Pledges.
 */
export class Fund {
  constructor(
    /**
     * Unique ID for a fund assigned by Big Give, in Salesforce case-insensitive format. 18 character string.
     */
    public id: string,
    public type: string,
    public name: string,
    public totalAmount: number,
    public amountRaised?: number,
    public description?: string,
    public logoUri?: string,
    ) {}
}
