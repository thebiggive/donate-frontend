import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = { enableEditHomeAddress: boolean; enableWithdrawFunds: boolean; enableOrgAccount: boolean };

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return { enableEditHomeAddress: true, enableWithdrawFunds: true, enableOrgAccount: true };
    case 'regression':
      return { enableEditHomeAddress: true, enableWithdrawFunds: true, enableOrgAccount: true };
    case 'staging':
      return { enableEditHomeAddress: true, enableWithdrawFunds: true, enableOrgAccount: true };
    case 'production':
      return { enableEditHomeAddress: true, enableWithdrawFunds: true, enableOrgAccount: false };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
