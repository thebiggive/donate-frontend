// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Person } from "./person.model";

/**
 * Donor account details as accessed via Matchbot. This is similar to the Person details held in Identity,
 * but some fields are only available here, e.g. regularGivingPaymentMethod, billingPostCode and billingCountryCode
 *
 * @see {Person}
 */
export interface DonorAccount {
    /**
     * UUID.
     */
    id?: string;

    fullName: string;
    stripeCustomerId: string;
    regularGivingPaymentMethod: null | string;
    billingPostCode: string;
    billingCountryCode: string;
}
