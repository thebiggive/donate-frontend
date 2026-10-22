import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = {
  enableOrgAccount: true;
  enableSearchByLocation: boolean;
  enableMapViewInExplore: boolean;
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
      };
    case 'regression':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
      };
    case 'staging':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
      };
    case 'production':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: false,
        enableMapViewInExplore: false,
      };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
