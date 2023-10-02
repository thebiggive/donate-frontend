import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

export const flagsForEnvironment = (_: EnvironmentID) => {
  return {
    abTestingEnabled: (environment.environmentId === 'development' || environment.environmentId === 'staging'),
    // Banner needs more work to look right and be useful before release - see ticket
    // DON-783
    cookieBannerEnabled: (environment.environmentId === 'development' || environment.environmentId === 'staging'),
  };
}

export const flags = flagsForEnvironment(environment.environmentId);
