import {environment} from "../environments/environment";
export const flags = {
  profilePageEnabled: !environment.production && !environment.productionLike
};
