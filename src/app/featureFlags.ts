import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = { enableEditHomeAddress: boolean };

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return { enableEditHomeAddress: true };
    case 'regression':
      return { enableEditHomeAddress: true };
    case 'staging':
      return { enableEditHomeAddress: false };
    case 'production':
      return { enableEditHomeAddress: false };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
