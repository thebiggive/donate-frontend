import { environment } from '../environments/environment';
import { EnvironmentID } from '../environments/environment.interface';

type flags = {
  readonly regularGivingEnabled: boolean;

  /**
   * The matchbot campaign is in development, see ticket MAT-405. Not ready yet for use in prod but should
   * eventually replace the salesforce campaign api.
   *
   * Now true in all environments, @todo remove flag when we're confident we won't need to switch it off.
   */
  readonly useMatchbotCampaignApi: boolean;

  /**
   * Another part of MAT-405 - but rather than turning on now in prod like useMatchbotCampaignApi
   * planning to leave off until we have made sure that the prod matchbot DB has up-to-date data
   * so that matchbot won't need to act as a proxy for SF for this api route.
   */
  readonly useMatchbotCharityApi: boolean;

  /**
   * Another part of MAT-405 like useMatchbotCharityApi
   */
  readonly useMatchbotMetaCampaignApi: boolean;
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {
        regularGivingEnabled: true,
        useMatchbotCampaignApi: true,
        useMatchbotCharityApi: true,
        useMatchbotMetaCampaignApi: true,
      };
    case 'regression':
      return {
        regularGivingEnabled: true,
        useMatchbotCampaignApi: true,
        useMatchbotCharityApi: false,
        useMatchbotMetaCampaignApi: true, // none of our regression test scenarios actually look at a metacampaign so this doesn't matter.
      };
    case 'staging':
      return {
        regularGivingEnabled: true,
        useMatchbotCampaignApi: true,
        useMatchbotCharityApi: false, // campaign data is not quite complete or up to date enough to use yet in staging
        useMatchbotMetaCampaignApi: true, // but metacampaign data **is**, since there are only a few relavent metacampaigns
      };
    case 'production':
      return {
        regularGivingEnabled: false,
        useMatchbotCampaignApi: true, // must be false for now as campaign data isn't yet complete and up to date in prod matchbot db.
        useMatchbotCharityApi: false, // ditto for charities
        useMatchbotMetaCampaignApi: false, // matchbot metaCampaign table is empty in prod right now so must be false
      };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
