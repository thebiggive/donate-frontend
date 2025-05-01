import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = {
  readonly regularGivingEnabled: boolean;
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return { regularGivingEnabled: true };
    case 'regression':
      return { regularGivingEnabled: true };
    case 'staging':
      return { regularGivingEnabled: true };
    case 'production':
      return { regularGivingEnabled: false };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
