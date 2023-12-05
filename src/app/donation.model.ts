import { DonationStatus } from './donation-status.type';

export function maximumDonationAmount(currencyCode: string, creditPenceToUse: number): number {
  if (currencyCode !== 'GBP') {
    throw new Error(`No maximum defined for currency ${currencyCode}`);
  }

  if (creditPenceToUse > 0) {
    return Math.min(creditPenceToUse / 100, maximumDonationAmountForFundedDonation)
  }

  return maximumDonationAmountForCardDonation
}


export const maximumDonationAmountForCardDonation = 25_000;
export const maximumDonationAmountForFundedDonation = 200_000;
  /**
 * Many properties on `Donation` are nullable, because they are set only:
 * * after the donation has been persisted in Salesforce (e.g. `status`, `createdTime`, ...); or
 * * after the donor has completed payment section (e.g. `countryCode`, `emailAddress`, ...); or
 * * after the donation is fully processed and webhook returned (e.g. `matchedAmount`).
 */
export interface Donation {
    autoConfirmFromCashBalance?: boolean;

    /**
     * Unique ID for a charity Account assigned by Big Give, in Salesforce
     * case-insensitive format. 18 character string.
     */
    charityId: string;

    creationRecaptchaCode?: string;

    /**
     * ISO 4217 code for the currency in which all monetary values are denominated.
     */
    currencyCode: string;

    /**
     * Counted in major units of the relevant currency. Should be whole number.
     */
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
    // Could include letters. Up to 40 chars. Denormalised from homeAddress to increase
    // chance of accuracy for Gift Aid when a lookup service was used.
    homeBuildingNumber?: string;

    optInCharityEmail?: boolean;

    optInTbgEmail?: boolean;

    optInChampionEmail?: boolean;

    pspMethodType: 'card' | 'customer_balance';

    /**
     * Unique ID for a CCampaign / project assigned by Big Give, in Salesforce
     * case-insensitive format. 18 character string.
     */
    projectId: string;

    psp: 'stripe';

    pspCustomerId?: string;

    /**
     * Donor's address including postcode, or just postcode with Stripe. May be
     * omitted for US donors in future?
     */
    billingPostalAddress?: string;

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
     * Assigned earlier than PSP's `transactionId`.
     */
    donationId?: string;

    emailAddress?: string;

    feeCoverAmount: number;

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
     * One of the status strings defined in the `DonationStatus` type.
     * See `donation-status.enum.ts` where the type and backing enum are defined.
     */
    status?: DonationStatus;

    /**
     * Counted in major units of the relevant currency - may be fractional.
     */
    tipAmount: number;

    /**
     * ID assigned by PSP upon checkout initiation.
     */
    transactionId?: string;

    /**
     * ISO 8601 formatted datetime
     */
    updatedTime?: string;
}
