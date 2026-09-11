import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = {
  enableEditHomeAddress: boolean;
  enableWithdrawFunds: boolean;
  enableOrgAccount: boolean;
  enableSearchByLocation: boolean;
  enableMapViewInExplore: boolean;
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {
        enableEditHomeAddress: true,
        enableWithdrawFunds: true,
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
      };
    case 'regression':
      return {
        enableEditHomeAddress: true,
        enableWithdrawFunds: true,
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: false,
      };
    case 'staging':
      return {
        enableEditHomeAddress: true,
        enableWithdrawFunds: true,
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: false,
      };
    case 'production':
      return {
        enableEditHomeAddress: true,
        enableWithdrawFunds: true,
        enableOrgAccount: true,
        enableSearchByLocation: false,
        enableMapViewInExplore: false,
      };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
