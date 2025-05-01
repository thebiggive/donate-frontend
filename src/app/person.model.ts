// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DonorAccount } from './donorAccount.model';

/**
 * Donor account details as accessed via in Identity service. This is similar to the DonorAccount details held in Matchbot,
 * but several fields are only available here, e.g. cash_balance, has_password etc
 *
 * @see {DonorAccount}
 */
export interface Person {
  /**
   * UUID. Set on creation.
   */
  id?: string;

  /**
   * Required for creation.
   */
  captcha_code?: string;

  // @todo DON-1072 : Remove this from the model when id service defaults to using friendly_captcha
  captcha_type?: 'friendly_captcha';

  /**
   * Stores the credit available for the given Person
   */
  cash_balance?: { [currencyCode: string]: number };

  /**
   * The total of donor fund form-created pending tips for the given Person, counted in minor-currency units i.e. pence which will be fulfilled
   * by bank transfers
   */
  pending_tip_balance?: { [currencyCode: string]: number };

  /**
   * The total of donor fund form-created succeeded tips for the given Person, set up in the past 10 days, counted in minor-currency units i.e. pence
   */
  recently_confirmed_tips_total?: { [currencyCode: string]: number };

  /**
   * These 3 expected on first update.
   */
  email_address?: string;
  first_name?: string;
  last_name?: string;

  /**
   * These 3 expected if donor's claiming Gift Aid.
   */
  home_address_line_1?: string;
  home_postcode?: string;
  home_country_code?: string;

  /**
   * Set on update if the donor opts to make a resuable account.
   */
  raw_password?: string;

  // Remaining properties are read-only and set by the server.

  /**
   * JSON Web Token that lets donor add data, including a password to make the account reusable.
   */
  completion_jwt?: string;
  has_password?: boolean;
  stripe_customer_id?: string;
  /**
   * ISO 8601 formatted datetimes
   */
  created_time?: string;
  updated_time?: string;
}
