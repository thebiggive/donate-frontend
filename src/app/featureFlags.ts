import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

const flagsForEnvironment = (environmentId: EnvironmentID) => {
  return {
    /** Should be removed and inlined soon, but keeping just while we're still testing out
     * Friendly Captcha and still have Recaptcha on some pages, rather than planning to use it permanently.
     *
     * If and when we remove this we can also remove all the code about recaptcha.
     */
    friendlyCaptchaEnabled: true,

    regularGivingEnabled: environmentId !== 'production',

    /**
     * Replaces our own custom display of saved cards that are fetch from Identity, with saved cards
     * inside the stripe payment element on the donation page.
     */
    stripeElementCardChoice: environmentId === 'development',
  } as const;
}

export const flags = flagsForEnvironment(environment.environmentId);
