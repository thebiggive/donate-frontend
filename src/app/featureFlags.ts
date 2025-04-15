import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

type flags = {
  readonly regularGivingEnabled: boolean;

 /**
  * Replaces our own custom display of saved cards that are fetch from Identity, with saved cards
  * inside the stripe payment element on the donation page.
  */
  readonly stripeElementCardChoice: true;

  /**
   * before this is enabled in prod the registration form needs to actually do really verification with the backend.
   * Need to update test for regular giving when enabling this in regression environment.
   */
  readonly requireEmailVerification: boolean;

  /**
   * Offering new accounts immediately after donation in FE is being phased out - instead the email sent by
   * matchbot will offer the donor a new account. It's fine to have an overlap, so the matchbot feature should be
   * turned on before this is turned off.
   */
  readonly offerNewAccountAfterDonation: boolean
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {regularGivingEnabled: true, stripeElementCardChoice: true, requireEmailVerification: true, offerNewAccountAfterDonation: false};
    case 'regression':
      return {regularGivingEnabled: true, stripeElementCardChoice: true, requireEmailVerification: false, offerNewAccountAfterDonation: true};
    case "staging":
      return {regularGivingEnabled: true, stripeElementCardChoice: true, requireEmailVerification: true, offerNewAccountAfterDonation: true};
    case "production":
      return {regularGivingEnabled: false, stripeElementCardChoice: true, requireEmailVerification: false, offerNewAccountAfterDonation: true};
  }
}

export const flags = flagsForEnvironment(environment.environmentId);
