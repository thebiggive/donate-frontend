import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = {
  enableOrgAccount: true;
  enableSearchByLocation: boolean;
  enableMapViewInExplore: boolean;
  enableMapFullScreenMobileMode: boolean; // Not ready and perhaps counterproductive with current select/zoom approach.
  enableUpdatedCampaignCardFilter: boolean;
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        enableMapFullScreenMobileMode: false,
        enableUpdatedCampaignCardFilter: true,
      };
    case 'regression':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        enableMapFullScreenMobileMode: false,
        enableUpdatedCampaignCardFilter: true,
      };
    case 'staging':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        enableMapFullScreenMobileMode: false,
        enableUpdatedCampaignCardFilter: true,
      };
    case 'production':
      return {
        enableOrgAccount: true,
        enableSearchByLocation: true,
        enableMapViewInExplore: true,
        enableMapFullScreenMobileMode: false,
        enableUpdatedCampaignCardFilter: true,
      };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
