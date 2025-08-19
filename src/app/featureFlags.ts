import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = object;

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
