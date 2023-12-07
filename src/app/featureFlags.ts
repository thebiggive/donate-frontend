import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

const flagsForEnvironment = (environmentId: EnvironmentID) => {
  return {
    loginPageEnabled: environmentId !== 'production'
  } as const;
}

export const flags = flagsForEnvironment(environment.environmentId);
