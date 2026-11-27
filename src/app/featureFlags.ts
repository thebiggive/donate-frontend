import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = {
  enableOrgAccount: true;
  enableSearchByLocation: boolean;
  enableMapViewInExplore: boolean;
  bypassFriendlyCaptcha: boolean;
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        bypassFriendlyCaptcha: false,
      };
    case 'regression':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        bypassFriendlyCaptcha: false,
      };
    case 'staging':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        bypassFriendlyCaptcha: false,
      };
    case 'production':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        bypassFriendlyCaptcha: false,
      };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
