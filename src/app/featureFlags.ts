import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

export const flagsForEnvironment = (environmentId: EnvironmentID) => {
  return {
    don819FlagEnabled: (environmentId === 'development' || environmentId == 'staging'),
  };
}

export const flags = flagsForEnvironment(environment.environmentId);
