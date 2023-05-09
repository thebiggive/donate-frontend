import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const flagsForEnvironment = (environmentId: EnvironmentID) => {
  return {
    // no feature flags of this sort currently in use.
  };
}

export const flags = flagsForEnvironment(environment.environmentId);
