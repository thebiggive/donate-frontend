import { completeStatuses, DonationStatus } from './donation-status.type';
import { GIFT_AID_FACTOR } from './Money';

export function maximumDonationAmount(currencyCode: string, creditPenceToUse: number): number {
  if (currencyCode !== 'GBP') {
    throw new Error(`No maximum defined for currency ${currencyCode}`);
  }

  if (creditPenceToUse > 0) {
    return Math.min(creditPenceToUse / 100, maximumDonationAmountForFundedDonation);
  }

  return maximumDonationAmountForCardDonation;
}

export const maximumDonationAmountForCardDonation = 25_000;
export const maximumDonationAmountForFundedDonation = 200_000;

/**
 * Placeholder for postcode and country code used when a donor from outside the UK claims gift aid
 * See also \MatchBot\Domain\Donation::OVERSEAS
 * */
export const OVERSEAS = 'OVERSEAS';

/**
 * Many properties on `Donation` are nullable, because they are set only:
 * * after the donation has been persisted in Salesforce (e.g. `status`, `createdTime`, ...); or
 * * after the donor has completed payment section (e.g. `countryCode`, `emailAddress`, ...); or
 * * after the donation is fully processed and webhook returned (e.g. `matchedAmount`).
 */
export interface Donation {
  /**
   * The regular giving agreement relating to this donation, if any. Optional property because production
   * matchbot doesn't yet send it. Not a full representation of the mandate, just enough to be able to render
   * a link to it etc.
   */
  mandate?: {
    uuid: string;
    activeFrom: string;
  };

  autoConfirmFromCashBalance?: boolean;

  /**
   * Unique ID for a charity Account assigned by Big Give, in Salesforce
   * case-insensitive format. 18 character string.
   */
  readonly charityId: string;

  /**
   * ISO 4217 code for the currency in which all monetary values are denominated.
   */
  readonly currencyCode: string;

  /**
   * Counted in major units of the relevant currency. Should be whole number.
   */
  readonly donationAmount: number;

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

  readonly pspMethodType: 'card' | 'customer_balance' | 'pay_by_bank';

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
   * ISO 8601 formatted datetime
   */
  collectedTime?: string;

  /**
   * Unique ID for a donation, in Salesforce case-insensitive format. 18 character string.
   * Assigned earlier than PSP's `transactionId`.
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

export interface CompleteDonation extends Donation {
  /**
   * Total amount paid to Big Give by the donor.
   */
  totalPaid: number;
  status: (typeof completeStatuses)[number];

  /**
   * ISO 8601 formatted datetime
   */
  collectedTime: string;
}

/**
 * A complete donation with some additional properties that for now are computed in browser rather than sent from
 * matchbot. May be removed soon if calculations are moved to matchbot, where results can be saved to db.
 */
export interface EnrichedDonation extends CompleteDonation {
  /** How much the charity will (or did) receive in total */
  totalValue: number;
  giftAidAmount: number;
}

export function isLargeDonation(donation: Donation) {
  return donation.currencyCode === 'GBP' && donation.donationAmount >= 5_000;
}

export function withComputedProperties(donation: CompleteDonation): EnrichedDonation {
  // calculations here duplicate those in thanks page. Consider moving to matchbot soon.
  const giftAidAmount = donation.giftAid ? GIFT_AID_FACTOR * donation.donationAmount : 0;
  return {
    ...donation,
    giftAidAmount: giftAidAmount,
    totalValue: donation.donationAmount + giftAidAmount + donation.matchedAmount,
  };
}
