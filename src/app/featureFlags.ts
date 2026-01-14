import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = { enableEditHomeAddress: boolean; enableDeleteAccount: boolean; enableWithdrawFunds: boolean };

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return { enableEditHomeAddress: true, enableDeleteAccount: true, enableWithdrawFunds: true };
    case 'regression':
      return { enableEditHomeAddress: true, enableDeleteAccount: true, enableWithdrawFunds: true };
    case 'staging':
      return { enableEditHomeAddress: true, enableDeleteAccount: true, enableWithdrawFunds: true };
    case 'production':
      return { enableEditHomeAddress: true, enableDeleteAccount: true, enableWithdrawFunds: false };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
