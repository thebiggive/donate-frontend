import { DonationStatus } from './donation-status.type';

/**
 * Many properties on `Donation` are nullable, because they are set only:
 * * after the donation has been persisted in Salesforce (e.g. `status`, `createdTime`, ...); or
 * * after the donor has completed the Charity Checkout forms (e.g. `countryCode`, `emailAddress`, ...); or
 * * after the donation is fully processed and webhook returned (e.g. `matchedAmount`).
 */
export interface Donation {
    /**
     * Unique ID for a charity Account assigned by the Big Give, in Salesforce
     * case-insensitive format. 18 character string.
     */
    charityId: string;

    donationAmount: number;

    /**
     * Indicates whether donation was expected to be eligible for either full or partial matching
     * when initiated. Does not necessarily indicate a full or completed match. See also
     * `matchReservedAmount` and `matchedAmount`.
     */
    donationMatched: boolean;

    giftAid?: boolean;
    tipGiftAid?: boolean;
    homePostcode?: string;
    homeAddress?: string;

    optInCharityEmail?: boolean;

    optInTbgEmail?: boolean;

    /**
     * Unique ID for a CCampaign / project assigned by the Big Give, in Salesforce
     * case-insensitive format. 18 character string.
     */
    projectId: string;

    psp: 'enthuse' | 'stripe';

    /**
     * Donor's address including postcode.
     */
    billingPostalAddress?: string;

    /**
     * Used to complete payment details with some PSPs, e.g. Stripe.
     */
    clientSecret?: string;

    charityLogo?: string;

    charityName?: string;

    /**
     * Donor's country code in ISO 3166-1 alpha-2 format.
     */
    countryCode?: string;

    /**
     * ISO 8601 formatted datetime
     */
    createdTime?: string;

    /**
     * Unique ID for a donation, in Salesforce case-insensitive format. 18 character string.
     * Assigned earlier than Charity Checkout's `transactionId`.
     */
    donationId?: string;

    emailAddress?: string;

    firstName?: string;

    lastName?: string;

    /**
     * Amount actually matched once donation is Collected or Paid.
     */
    matchedAmount: number;

    /**
     * Amount allocated for matching when donation initiated.
     */
    matchReservedAmount: number;

    /**
     * One of the Charity Checkout status strings defined in the `DonationStatus` type.
     * See `donation-status.enum.ts` where the type and backing enum are defined.
     */
    status?: DonationStatus;

    tipAmount: number;

    /**
     * ID assigned by Charity Checkout upon checkout initiation.
     */
    transactionId?: string;

    /**
     * ISO 8601 formatted datetime
     */
    updatedTime?: string;
}
