import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = { mailingListSignup: boolean; easierZeroTip: boolean };

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return { mailingListSignup: true, easierZeroTip: true };
    case 'regression':
      return { mailingListSignup: true, easierZeroTip: true };
    case 'staging':
      return { mailingListSignup: true, easierZeroTip: false };
    case 'production':
      return { mailingListSignup: true, easierZeroTip: false };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
