import {environment} from "../environments/environment";
import {Environment} from "../environments/environment.interface";

export const flagsForEnvironment = (environment: Environment) => {
  return {
    profilePageEnabled: !environment.production
  };
}

export const flags = flagsForEnvironment(environment);
