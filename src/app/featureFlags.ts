import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

const flagsForEnvironment = (_environmentId: EnvironmentID) => {
  return {
  } as const;
}

export const flags = flagsForEnvironment(environment.environmentId);
