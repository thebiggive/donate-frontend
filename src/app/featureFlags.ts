import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

export const flagsForEnvironment = (environmentId: EnvironmentID) => {
  return {
    skipToContentLinkEnabled: environmentId !== 'production',
  } as const;
}

export const flags = flagsForEnvironment(environment.environmentId);
