import { DonationStatus } from './donation-status.type';

export class Donation {
  constructor(
    /**
     * Donor's address including postcode.
     */
    public billingPostalAddress: string,

    /**
     * Unique ID for a charity Account assigned by the Big Give, in Salesforce
     * case-insensitive format. 18 character string.
     */
    public charityId: string,

    /**
     * Donor's country code in ISO 3166-1 alpha-2 format.
     */
    public countryCode: string,

    public createdTime: Date,

    public donationAmount: number,

    /**
     * Unique ID for a donation, in Salesforce case-insensitive format. 18 character string.
     * Assigned earlier than Charity Checkout's `transactionId`.
     */
    public donationId: string,

    /**
     * Indicates whether donation was expected to be eligible for either full or partial matching
     * when initiated. Does not necessarily indicate a full or completed match. See also
     * `matchReservedAmount` and `matchedAmount`.
     */
    public donationMatched: boolean,

    public emailAddress: string,

    public firstName: string,

    public giftAid: boolean,

    public lastName: string,

    /**
     * Amount actually matched once donation is Collected or Paid.
     */
    public matchedAmount: number,

    /**
     * Amount allocated for matching when donation initiated.
     */
    public matchReservedAmount: number,

    public optInTbgEmail: boolean,

    /**
     * Unique ID for a CCampaign / project assigned by the Big Give, in Salesforce
     * case-insensitive format. 18 character string.
     */
    public projectId: string,

    /**
     * One of the Charity Checkout status strings defined in the `DonationStatus` type.
     * See `donation-status.enum.ts` where the type and backing enum are defined.
     */
    public status: DonationStatus,

    /**
     * ID assigned by Charity Checkout upon checkout initiation.
     */
    public transactionId: string,

    public updatedTime: Date,
  ) {}
}
