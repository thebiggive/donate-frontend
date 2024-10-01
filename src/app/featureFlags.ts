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
  } as const;
}

export const flags = flagsForEnvironment(environment.environmentId);
