import { TestBed } from '@angular/core/testing';

import { CharityCheckoutDonation } from './charity-checkout-donation.model';
import { Donation } from './donation.model';

describe('CharityCheckoutDonation model', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should translate a donation with all opt-ins but TBG contact true correctly', () => {
    const donation: Donation = {
      charityId: 'someCharityId',
      charityName: 'My Test Charity',
      donationAmount: 1234.56,
      donationMatched: true,
      donationId: 'someDonationId',
      giftAid: true,
      matchReservedAmount: 1100.00,
      optInCharityEmail: true,
      optInTbgEmail: false,
      projectId: 'someProjectId',
    };
    const charityCheckoutDonation: CharityCheckoutDonation = new CharityCheckoutDonation(donation);

    expect(charityCheckoutDonation.allow_TBG_contact).toBe('0');
    expect(charityCheckoutDonation.charity_id).toBe('someCharityId');
    expect(charityCheckoutDonation.charity_name).toBe('My Test Charity');
    expect(charityCheckoutDonation.donation_amount).toBe(1234.56);
    expect(charityCheckoutDonation.donation_type).toBe('em1');
    expect(charityCheckoutDonation.gift_aid).toBe('1');
    expect(charityCheckoutDonation.project_id).toBe('someProjectId');
    expect(charityCheckoutDonation.reservation_time).toBeGreaterThan(0);
    expect(charityCheckoutDonation.reservation_time).toBeLessThanOrEqual(Math.floor((new Date()).getTime()));
    expect(charityCheckoutDonation.share_details_with_charity).toBe('1'); // Always true
    expect(charityCheckoutDonation.unique_ID).toBe('someDonationId');
  });

  it('should not start a reservation timer if no matching could be allocated', () => {
    // As above except for zero reserved match funds
    const donation: Donation = {
      charityId: 'someCharityId',
      charityName: 'My Test Charity',
      donationAmount: 1234.56,
      donationMatched: true,
      donationId: 'someDonationId',
      giftAid: true,
      matchReservedAmount: 0.00,
      optInCharityEmail: true,
      optInTbgEmail: false,
      projectId: 'someProjectId',
    };
    const charityCheckoutDonation: CharityCheckoutDonation = new CharityCheckoutDonation(donation);

    expect(charityCheckoutDonation.donation_type).toBe('em1');
    expect(charityCheckoutDonation.reservation_time).toBeNull();
  });

  it('should translate a donation with all opt-ins but TBG contact false correctly', () => {
    const donation: Donation = {
      charityId: 'someOtherCharityId',
      charityName: 'My Other Test Charity',
      donationAmount: 12,
      donationMatched: false,
      donationId: 'someOtherDonationId',
      giftAid: false,
      optInCharityEmail: false,
      optInTbgEmail: true,
      projectId: 'someOtherProjectId',
    };

    const charityCheckoutDonation: CharityCheckoutDonation = new CharityCheckoutDonation(donation);

    expect(charityCheckoutDonation.allow_TBG_contact).toBe('1');
    expect(charityCheckoutDonation.charity_id).toBe('someOtherCharityId');
    expect(charityCheckoutDonation.charity_name).toBe('My Other Test Charity');
    expect(charityCheckoutDonation.donation_amount).toBe(12);
    expect(charityCheckoutDonation.donation_type).toBe('ind1');
    expect(charityCheckoutDonation.gift_aid).toBe('0');
    expect(charityCheckoutDonation.project_id).toBe('someOtherProjectId');
    expect(charityCheckoutDonation.reservation_time).toBeNull();
    expect(charityCheckoutDonation.share_details_with_charity).toBe('1'); // Always true
    expect(charityCheckoutDonation.unique_ID).toBe('someOtherDonationId');
  });
});
