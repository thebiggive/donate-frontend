import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = { mailingListSignup: boolean };

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return { mailingListSignup: true };
    case 'regression':
      return { mailingListSignup: true };
    case 'staging':
      return { mailingListSignup: true };
    case 'production':
      return { mailingListSignup: true };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
