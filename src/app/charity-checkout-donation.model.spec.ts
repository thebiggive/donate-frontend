import { TestBed } from '@angular/core/testing';

import { CharityCheckoutDonation } from './charity-checkout-donation.model';
import { Donation } from './donation.model';

describe('CharityCheckoutDonation model', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should translate a donation with all opt-ins but TBG contact true correctly', () => {
    const donation = new Donation(
      'someCharityId',
      1234.56,
      true,
      true,
      true,
      false,
      'someProjectId',
      null,
      'My Test Charity',
      null,
      null,
      'someDonationId',
    );
    const charityCheckoutDonation: CharityCheckoutDonation = new CharityCheckoutDonation(donation);

    expect(charityCheckoutDonation.allow_TBG_contact).toBe('0');
    expect(charityCheckoutDonation.charity_id).toBe('someCharityId');
    expect(charityCheckoutDonation.charity_name).toBe('My Test Charity');
    expect(charityCheckoutDonation.donation_amount).toBe(1234.56);
    expect(charityCheckoutDonation.donation_type).toBe('em1');
    expect(charityCheckoutDonation.gift_aid).toBe('1');
    expect(charityCheckoutDonation.mode).toBe('donation');
    expect(charityCheckoutDonation.project_id).toBe('someProjectId');
    expect(charityCheckoutDonation.reservation_time).toBeGreaterThan(0);
    expect(charityCheckoutDonation.reservation_time).toBeLessThanOrEqual(Math.floor((new Date()).getTime()));
    expect(charityCheckoutDonation.share_details_with_charity).toBe('1'); // Always true
    expect(charityCheckoutDonation.unique_ID).toBe('someDonationId');
  });

  it('should translate a donation with all opt-ins but TBG contact false correctly', () => {
    const donation = new Donation(
      'someOtherCharityId',
      12,
      false,
      false,
      false,
      true,
      'someOtherProjectId',
      null,
      'My Other Test Charity',
      null,
      null,
      'someOtherDonationId',
    );

    const charityCheckoutDonation: CharityCheckoutDonation = new CharityCheckoutDonation(donation);

    expect(charityCheckoutDonation.allow_TBG_contact).toBe('1');
    expect(charityCheckoutDonation.charity_id).toBe('someOtherCharityId');
    expect(charityCheckoutDonation.charity_name).toBe('My Other Test Charity');
    expect(charityCheckoutDonation.donation_amount).toBe(12);
    expect(charityCheckoutDonation.donation_type).toBe('ind1');
    expect(charityCheckoutDonation.gift_aid).toBe('0');
    expect(charityCheckoutDonation.mode).toBe('donation');
    expect(charityCheckoutDonation.project_id).toBe('someOtherProjectId');
    expect(charityCheckoutDonation.reservation_time).toBeNull();
    expect(charityCheckoutDonation.share_details_with_charity).toBe('1'); // Always true
    expect(charityCheckoutDonation.unique_ID).toBe('someOtherDonationId');
  });
});
