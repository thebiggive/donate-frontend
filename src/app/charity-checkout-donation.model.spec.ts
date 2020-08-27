import { TestBed } from '@angular/core/testing';

import { CharityCheckoutDonation } from './charity-checkout-donation.model';
import { Donation } from './donation.model';

describe('CharityCheckoutDonation model', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should translate a donation with all opt-ins but TBG contact true correctly', () => {
    const donation: Donation = {
      charityId: 'someCharityId',
      charityName: 'My Test Charity',
      createdTime: (new Date()).toISOString(),
      donationAmount: 1234.56,
      donationMatched: true,
      donationId: 'someDonationId',
      giftAid: true,
      matchedAmount: 0,
      matchReservedAmount: 1100.00,
      optInCharityEmail: true,
      optInTbgEmail: false,
      projectId: 'someProjectId',
      psp: 'enthuse',
      tipAmount: 0,
    };

    const logoUri = 'http://unitTestLogoURL.com';
    const charityCheckoutDonation: CharityCheckoutDonation = new CharityCheckoutDonation(donation, logoUri);

    expect(charityCheckoutDonation.allow_TBG_contact).toBe('0');
    expect(charityCheckoutDonation.charity_id).toBe('someCharityId');
    expect(charityCheckoutDonation.charity_logo).toBe(logoUri);
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
      matchedAmount: 0.00,
      matchReservedAmount: 0.00,
      optInCharityEmail: true,
      optInTbgEmail: false,
      projectId: 'someProjectId',
      psp: 'enthuse',
      tipAmount: 0.00,
    };

    const logoUri = 'http://unitTestLogoURL.com';
    const charityCheckoutDonation: CharityCheckoutDonation = new CharityCheckoutDonation(donation, logoUri);

    expect(charityCheckoutDonation.donation_type).toBe('em1');
    expect(charityCheckoutDonation.reservation_time).toBeUndefined();
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
      matchedAmount: 0.00,
      matchReservedAmount: 0.00,
      projectId: 'someOtherProjectId',
      psp: 'enthuse',
      tipAmount: 0.00,
    };

    const logoUri = 'http://unitTestLogoURL.com';
    const charityCheckoutDonation: CharityCheckoutDonation = new CharityCheckoutDonation(donation, logoUri);

    expect(charityCheckoutDonation.allow_TBG_contact).toBe('1');
    expect(charityCheckoutDonation.charity_id).toBe('someOtherCharityId');
    expect(charityCheckoutDonation.charity_logo).toBe(logoUri);
    expect(charityCheckoutDonation.charity_name).toBe('My Other Test Charity');
    expect(charityCheckoutDonation.donation_amount).toBe(12);
    expect(charityCheckoutDonation.donation_type).toBe('ind1');
    expect(charityCheckoutDonation.gift_aid).toBe('0');
    expect(charityCheckoutDonation.project_id).toBe('someOtherProjectId');
    expect(charityCheckoutDonation.reservation_time).toBeUndefined();
    expect(charityCheckoutDonation.share_details_with_charity).toBe('1'); // Always true
    expect(charityCheckoutDonation.unique_ID).toBe('someOtherDonationId');
  });
});
