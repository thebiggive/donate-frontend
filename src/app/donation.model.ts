import { DonationStatus } from './donation-status.type';

/**
 * Many properties on `Donation` are nullable, because they are set only:
 * * after the donation has been persisted in Salesforce (e.g. `status`, `createdTime`, ...); or
 * * after the donor has completed the Charity Checkout forms (e.g. `countryCode`, `emailAddress`, ...); or
 * * after the donation is fully processed and webhook returned (e.g. `matchedAmount`).
 */
export class Donation {
  constructor(
    /**
     * Unique ID for a charity Account assigned by the Big Give, in Salesforce
     * case-insensitive format. 18 character string.
     */
    public charityId: string,

    public donationAmount: number,

    /**
     * Indicates whether donation was expected to be eligible for either full or partial matching
     * when initiated. Does not necessarily indicate a full or completed match. See also
     * `matchReservedAmount` and `matchedAmount`.
     */
    public donationMatched: boolean,

    public giftAid: boolean,

    public optInCharityEmail: boolean,

    public optInTbgEmail: boolean,

    /**
     * Unique ID for a CCampaign / project assigned by the Big Give, in Salesforce
     * case-insensitive format. 18 character string.
     */
    public projectId: string,

    /**
     * Donor's address including postcode.
     */
    public billingPostalAddress?: string,

    public charityName?: string,

    /**
     * Donor's country code in ISO 3166-1 alpha-2 format.
     */
    public countryCode?: string,

    public createdTime?: Date,

    /**
     * Unique ID for a donation, in Salesforce case-insensitive format. 18 character string.
     * Assigned earlier than Charity Checkout's `transactionId`.
     */
    public donationId?: string,

    public emailAddress?: string,

    public firstName?: string,

    public lastName?: string,

    /**
     * Amount actually matched once donation is Collected or Paid.
     */
    public matchedAmount?: number,

    /**
     * Amount allocated for matching when donation initiated.
     */
    public matchReservedAmount?: number,

    /**
     * One of the Charity Checkout status strings defined in the `DonationStatus` type.
     * See `donation-status.enum.ts` where the type and backing enum are defined.
     */
    public status?: DonationStatus,

    public tipAmount?: number,

    /**
     * ID assigned by Charity Checkout upon checkout initiation.
     */
    public transactionId?: string,

    public updatedTime?: Date,
    ) {}
}
