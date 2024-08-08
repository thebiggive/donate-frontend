import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

const flagsForEnvironment = (environmentId: EnvironmentID) => {
  return {
    myDonationsEnabled: environmentId !== 'production',

    // Friendly Captcha only in dev as we have to add support to identity service before enabling in staging.
    friendlyCaptchaEnabled: environmentId !== 'production',

    regularGivingEnabled: environmentId == 'development'
  } as const;
}

export const flags = flagsForEnvironment(environment.environmentId);
