import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

export const flagsForEnvironment = (environmentId: EnvironmentID) => {
  return {
    profilePageEnabled: true
  };
}

export const flags = flagsForEnvironment(environment.environmentId);
