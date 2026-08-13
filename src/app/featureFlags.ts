import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = {
  enableEditHomeAddress: boolean;
  enableWithdrawFunds: boolean;
  enableOrgAccount: boolean;
  enableSearchByLocation: boolean;

  /**
   * New process for regular giving where the donor doesn't have to have an account before they see the form,
   * instead they have to create or login as a step within the stepper.
   */
  enableCondensedRegularGivingSignup: boolean;
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {
        enableEditHomeAddress: true,
        enableWithdrawFunds: true,
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableCondensedRegularGivingSignup: true,
      };
    case 'regression':
      return {
        enableEditHomeAddress: true,
        enableWithdrawFunds: true,
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableCondensedRegularGivingSignup: false,
      };
    case 'staging':
      return {
        enableEditHomeAddress: true,
        enableWithdrawFunds: true,
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableCondensedRegularGivingSignup: false,
      };
    case 'production':
      return {
        enableEditHomeAddress: true,
        enableWithdrawFunds: true,
        enableOrgAccount: true,
        enableSearchByLocation: false,
        enableCondensedRegularGivingSignup: false,
      };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
