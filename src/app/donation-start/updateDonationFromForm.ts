import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {FormGroup} from "@angular/forms";
import {DonationService} from "../donation.service";
import {Donation} from "../donation.model";
import {Campaign} from "../campaign.model";
import {sanitiseCurrency} from "./sanitiseCurrency";


export function updateDonationFromForm
(event: StepperSelectionEvent,
 tipValue: number|undefined,
 donation: Donation,
 paymentGroup: FormGroup,
 amountsGroup: FormGroup,
 giftAidGroup: FormGroup,
 donationService: DonationService,
 campaign: Campaign,
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
    donation.homePostcode = giftAidGroup.value.homeOutsideUK ? 'OVERSEAS' : giftAidGroup.value.homePostcode;
    donation.homeAddress = giftAidGroup.value.homeAddress;
    // Optional additional field to improve data alignment w/ HMRC when a lookup was used.
    donation.homeBuildingNumber = giftAidGroup.value.homeBuildingNumber || undefined;
  } else {
    donation.homePostcode = undefined;
    donation.homeAddress = undefined;
    donation.homeBuildingNumber = undefined;
  }
  donationService.updateLocalDonation(donation);
}
