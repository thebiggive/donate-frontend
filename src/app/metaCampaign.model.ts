/**
 * Represents a metacampaign as it exists in Salesforce.
 * As discussed with @NoelLH we may be likely to delete this class and use Campaign instead.
 */
export class MetaCampaign {
  constructor(
    public campaignGivenName: string,
    public isEmergency: boolean,
    public slug: string,
    public colour: 'primary' | 'brand-4', // change this type to match however the colours are sent from SF.
  ) {
  }
}
