/**
 * Only Champion Fundings are used in the app thus far, not Pledges.
 */
export type Fund = {
    /**
     * Unique ID for a fund assigned by Big Give, in Salesforce case-insensitive format. 18 character string.
     */
    id: string,
    type: string,
    name: string,
    // totalForTicker is a new field SF should start sending in Feb 2024 - so we don't yet rely on it being present.
    totalForTicker?: number,
    totalAmount: number,
    amountRaised?: number,
    description?: string,
    logoUri?: string,
}
