import { FormGroup } from '@angular/forms';
import { DonationService } from '../donation.service';
import { Donation, OVERSEAS } from '../donation.model';
import { sanitiseCurrency } from './sanitiseCurrency';

export function updateDonationFromForm(
  tipValue: number | undefined,
  donation: Donation,
  paymentGroup: FormGroup,
  amountsGroup: FormGroup,
  giftAidGroup: FormGroup,
  donationService: DonationService,
  marketingGroup: FormGroup,
) {
  if (paymentGroup) {
    donation.emailAddress = paymentGroup.value.emailAddress;
    donation.firstName = paymentGroup.value.firstName;
    donation.lastName = paymentGroup.value.lastName;
  }

  donation.giftAid = giftAidGroup.value.giftAid;

  donation.tipGiftAid = giftAidGroup.value.giftAid;

  donation.optInCharityEmail = marketingGroup.value.optInCharityEmail;
  donation.optInTbgEmail = marketingGroup.value.optInTbgEmail;
  donation.optInChampionEmail = marketingGroup.value.optInChampionEmail;

  if (typeof tipValue === 'number') {
    donation.tipAmount = tipValue;
  } else {
    donation.tipAmount = sanitiseCurrency(amountsGroup.value.tipAmount);
  }

  if (donation.giftAid || donation.tipGiftAid) {
    donation.homePostcode = giftAidGroup.value.homeOutsideUK ? OVERSEAS : giftAidGroup.value.homePostcode;
    donation.homeAddress = giftAidGroup.value.homeAddress;
  } else {
    donation.homePostcode = undefined;
    donation.homeAddress = undefined;
  }
  donationService.updateLocalDonation(donation);
}
