import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = {
  enableOrgAccount: true;
  enableSearchByLocation: boolean;
  enableMapViewInExplore: boolean;
  enableMapFullScreenMobileMode: boolean; // Not ready and perhaps counterproductive with current select/zoom approach.
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        enableMapFullScreenMobileMode: false,
      };
    case 'regression':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        enableMapFullScreenMobileMode: false,
      };
    case 'staging':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        enableMapFullScreenMobileMode: false,
      };
    case 'production':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        enableMapFullScreenMobileMode: false,
      };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
