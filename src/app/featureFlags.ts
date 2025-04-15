import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

const flagsForEnvironment = (environmentId: EnvironmentID) => {
  return {
    regularGivingEnabled: environmentId !== 'production',

    /**
     * Replaces our own custom display of saved cards that are fetch from Identity, with saved cards
     * inside the stripe payment element on the donation page.
     */
    stripeElementCardChoice: true,

    // before this is enabled in prod the registration form needs to actually do realy verification with the backend.
    // Need to update test for regular giving when enabling this in regression environment.
    requireEmailVerification: environmentId !== 'production' && environmentId !== 'regression',

    // Offering new accounts immediately after donation in FE is being phased out - instead the email sent by
    // matchbot will offer the donor a new account. It's fine to have an overlap, so the matchbot feature should be
    // turned on before this is turned off.
    offerNewAccountAfterDonation: environmentId !== 'development'
  } as const;
}

export const flags = flagsForEnvironment(environment.environmentId);
