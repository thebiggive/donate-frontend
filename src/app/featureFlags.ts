import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = { enableEditHomeAddress: boolean; enableWithdrawFunds: boolean };

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return { enableEditHomeAddress: true, enableWithdrawFunds: true };
    case 'regression':
      return { enableEditHomeAddress: true, enableWithdrawFunds: true };
    case 'staging':
      return { enableEditHomeAddress: true, enableWithdrawFunds: true };
    case 'production':
      return { enableEditHomeAddress: true, enableWithdrawFunds: true };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
