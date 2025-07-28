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

  readonly useMatchbotCampaignSearchApi: boolean;

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

  /**
   * DON-1120: Use new rectangular banner style on home and explore pages. It will eventually also be used on
   * meta-campaign pages, but that's set on a per-campaign basis in matchbot, not just per environment.
   */
  readonly don1120NewBannerStyle: boolean;
};

const flagsForEnvironment: (environmentId: EnvironmentID) => flags = (environmentId: EnvironmentID) => {
  switch (environmentId) {
    case 'development':
      return {
        regularGivingEnabled: true,
        useMatchbotCampaignApi: true,
        useMatchbotCampaignSearchApi: true,
        useMatchbotCharityApi: true,
        useMatchbotMetaCampaignApi: true,
        don1120NewBannerStyle: true,
      };
    case 'regression':
      return {
        regularGivingEnabled: true,
        useMatchbotCampaignApi: true,
        useMatchbotCampaignSearchApi: true,
        useMatchbotCharityApi: true,
        useMatchbotMetaCampaignApi: true, // none of our regression test scenarios actually look at a metacampaign so this doesn't matter.
        don1120NewBannerStyle: true,
      };
    case 'staging':
      return {
        regularGivingEnabled: true,
        useMatchbotCampaignApi: true,
        useMatchbotCampaignSearchApi: true,
        useMatchbotCharityApi: true,
        useMatchbotMetaCampaignApi: true,
        don1120NewBannerStyle: true,
      };
    case 'production':
      return {
        regularGivingEnabled: true,
        useMatchbotCampaignApi: true,
        useMatchbotCampaignSearchApi: false,
        useMatchbotCharityApi: false,
        useMatchbotMetaCampaignApi: false, // matchbot metaCampaign table is empty in prod right now so must be false
        don1120NewBannerStyle: false,
      };
  }
};

export const flags = flagsForEnvironment(environment.environmentId);
