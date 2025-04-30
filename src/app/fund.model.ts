/**
 * Only Champion Fundings are used in the app thus far, not Pledges.
 */
export type Fund = {
  /**
   * Unique ID for a fund assigned by Big Give, in Salesforce case-insensitive format. 18 character string.
   */
  id: string;
  type: string;
  name: string;
  totalForTicker: number;
  amountRaised?: number;
  description?: string;
  logoUri?: string;
};
