import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

export const flagsForEnvironment = (_: EnvironmentID) => {
  return {
    don819FlagEnabled: (environment.environmentId === 'development'),
  };
}

export const flags = flagsForEnvironment(environment.environmentId);
