import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = {
  readonly regularGivingEnabled: boolean;

  /**
   * The matchbot campaign is in development, see ticket MAT-405. Not ready yet for use in prod but should
   * eventually replace the salesforce campaign api
   */
  readonly useMatchbotCampaignApi: boolean;
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return { regularGivingEnabled: true, useMatchbotCampaignApi: true };
    case 'regression':
      return { regularGivingEnabled: true, useMatchbotCampaignApi: false };
    case 'staging':
      return { regularGivingEnabled: true, useMatchbotCampaignApi: false };
    case 'production':
      return { regularGivingEnabled: false, useMatchbotCampaignApi: false };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
