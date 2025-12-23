import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = { enableEditHomeAddress: boolean; enableDeleteAccount: boolean };

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return { enableEditHomeAddress: true, enableDeleteAccount: true };
    case 'regression':
      return { enableEditHomeAddress: true, enableDeleteAccount: false };
    case 'staging':
      return { enableEditHomeAddress: false, enableDeleteAccount: false };
    case 'production':
      return { enableEditHomeAddress: false, enableDeleteAccount: false };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
