// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {DonationStartFormComponent} from "./donation-start/donation-start-form/donation-start-form.component";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {RegularGivingComponent} from "./regular-giving/regular-giving.component";

/**
 * Functions for use in auto-complete address suggestion forms. Originally extracted from
 * @see {DonationStartFormComponent} to re-use in
 * @see {RegularGivingComponent}
 */

export type HomeAddress = { homeAddress: string, homeBuildingNumber: string, homePostcode: string };
