import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

// Leaving for future flags.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type flags = {};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {};
    case 'regression':
      return {};
    case 'staging':
      return {};
    case 'production':
      return {};
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
