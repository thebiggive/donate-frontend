import { Donation } from './donation.model';
import { environment } from '../environments/environment';

export class CharityCheckoutDonation {
  // tslint:disable:variable-name These properties must match Charity Checkout snake_case POST parameters
  public allow_TBG_contact: string; // Pseudo-boolean '0' or '1'
  public change_donation_url: string;
  public charity_id: string;
  public charity_logo: string;
  public charity_name: string;
  public donation_amount: number;
  public donation_type: string;
  public gift_aid: string; // Pseudo-boolean '0' or '1'
  public project_id: string;
  public reservation_time?: number; // UNIX timestamp in seconds. Start of reservation window.
  public share_details_with_charity = '1'; // Donors' details are now always shared with charities
  public thanks_url: string;
  public unique_ID: string;
  // tslint:enable:variable-name

  constructor(donation: Donation, logoUri: string) {
    this.allow_TBG_contact = donation.optInTbgEmail ? '1' : '0';
    this.change_donation_url = `${environment.donateUriPrefix}/donate/${donation.projectId}`;
    this.charity_id = donation.charityId;
    this.charity_logo = logoUri ? logoUri : '';
    this.charity_name = donation.charityName ? donation.charityName : '';
    this.donation_amount = donation.donationAmount;
    this.donation_type = donation.donationMatched ? 'em1' : 'ind1'; // Indicates campaign type, event if this donation's not matched
    this.gift_aid = donation.giftAid ? '1' : '0';
    this.project_id = donation.projectId;
    // Triggers a Charity Checkout message about reserved match funds, so only non-null when we actually have some allocated.
    this.reservation_time =
      (donation.matchReservedAmount > 0 && donation.createdTime)
        ? Math.floor(new Date(donation.createdTime).getTime() / 1000)
        : undefined;
    this.thanks_url = `${environment.thanksUriPrefix}${donation.donationId}`;
    this.unique_ID = donation.donationId ? donation.donationId : '';
  }
}
