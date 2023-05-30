import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {AnalyticsService} from "../analytics.service";
import {FormGroup} from "@angular/forms";
import {DonationService} from "../donation.service";
import {Donation} from "../donation.model";
import {Campaign} from "../campaign.model";
import {sanitiseCurrency} from "./sanitiseCurrency";


export function updateDonationFromForm
(event: StepperSelectionEvent,
 tipValue: number|undefined,
 donation: Donation,
 analyticsService: AnalyticsService,
 paymentGroup: FormGroup,
 amountsGroup: FormGroup,
 giftAidGroup: FormGroup,
 donationService: DonationService,
 campaign: Campaign,
 marketingGroup: FormGroup,
 preparePaymentRequestButton: (donation: Donation, formgroup: FormGroup) => void,
) {
  if (paymentGroup) {
    donation.emailAddress = paymentGroup.value.emailAddress;
    donation.firstName = paymentGroup.value.firstName;
    donation.lastName = paymentGroup.value.lastName;
  }

  donation.feeCoverAmount = sanitiseCurrency(amountsGroup.value.feeCoverAmount);

  donation.giftAid = giftAidGroup.value.giftAid;

  // In alternative fee model, 'tip' is donor fee cover so not Gift Aid eligible.
  donation.tipGiftAid = campaign.feePercentage ? false : giftAidGroup.value.giftAid;

  donation.optInCharityEmail = marketingGroup.value.optInCharityEmail;
  donation.optInTbgEmail = marketingGroup.value.optInTbgEmail;
  donation.optInChampionEmail = marketingGroup.value.optInChampionEmail;

  const lastTipAmount = donation.tipAmount;
  if (typeof tipValue === 'number') {
    donation.tipAmount = tipValue;
  } else {
    donation.tipAmount = sanitiseCurrency(amountsGroup.value.tipAmount);
  }
  if (lastTipAmount !== donation.tipAmount) {
    preparePaymentRequestButton(donation, paymentGroup);
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

  if (event.selectedStep.label === 'Receive updates') {
    // Step 2 'Details' – whichever step(s) come before marketing prefs is the best fit for this step number.
    analyticsService.logCheckoutStep(2, campaign, donation);
  } else if (event.selectedStep.label === 'Confirm') {
    // Step 3 'Confirm' is actually fired when comms preferences are done (to maintain
    // historic order), i.e. when the new step is for finalising payment.
    analyticsService.logCheckoutStep(3, campaign, donation);
  }
}
