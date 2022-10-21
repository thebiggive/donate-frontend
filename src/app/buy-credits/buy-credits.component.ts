import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PaymentMethod } from '@stripe/stripe-js';
import { LoginModal } from '../login-modal/login-modal.component';
import { DonationService } from '../donation.service';
import { IdentityService } from '../identity.service';
import { Person } from '../person.model';
import { minMaxCurrencyValidatorWrapper } from '../validators/minMaxCurrencyValidatorWrapper';
import { environment } from 'src/environments/environment';
import { MatSelectChange } from '@angular/material/select';
import { FundingInstruction } from '../fundingInstruction.model';

@Component({
  selector: 'app-buy-credits',
  templateUrl: './buy-credits.component.html',
  styleUrls: ['./buy-credits.component.scss']
})
export class BuyCreditsComponent implements OnInit {

  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  isPurchaseComplete = false;
  isOptedIntoGiftAid = false;
  currency = '£';
  userFullName: string;
  creditForm: FormGroup;
  amountsGroup: FormGroup;
  giftAidGroup: FormGroup;
  minimumCreditAmount = environment.minimumCreditAmount;
  maximumCreditAmount = environment.maximumCreditAmount;
  maximumDonationAmount = environment.maximumDonationAmount;
  sortCode: string;
  accountNumber: string;
  accountHolderName: string;
  private initialTipSuggestedPercentage = 15;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private donationService: DonationService,
    private identityService: IdentityService,
    ) { }

  ngOnInit(): void {

    const idAndJWT = this.identityService.getIdAndJWT();
    if (idAndJWT !== undefined) {
      if (this.identityService.isTokenForFinalisedUser(idAndJWT.jwt)) {
        this.loadAuthedPersonInfo(idAndJWT.id, idAndJWT.jwt);
      }
    }

    else {
      this.showLoginDialog();
    }

    const formGroups: {
      amounts: FormGroup,
      giftAid: FormGroup
    } = {
      amounts: this.formBuilder.group({
        creditAmount: [null, [
          Validators.required,
          minMaxCurrencyValidatorWrapper(true, environment.minimumCreditAmount),
          minMaxCurrencyValidatorWrapper(false, environment.maximumCreditAmount),
          Validators.pattern('^[£$]?[0-9]+?(\\.00)?$'),
        ]],
        tipPercentage: [this.initialTipSuggestedPercentage],
        customTipAmount: [null, [
          // Explicitly enforce minimum custom tip amount of £0. This is already covered by the regexp
          // validation rule below, but it's good to add the explicit check for future-proofness
          Validators.min(0),
          // Below we validate the tip as a donation because when buying donation credits, tips are set
          // set as real donations to a dedicated Big Give SF campaign.
          // See MAT-266 and the Slack thread linked it its description for more context.
          minMaxCurrencyValidatorWrapper(false, environment.maximumDonationAmount),
          Validators.pattern('^[£$]?[0-9]+?(\\.00)?$'),
        ]],
      }),
      giftAid: this.formBuilder.group({
        giftAid: [null],
        homeAddress: [null],
        homeBuildingNumber: [null],
        homeOutsideUK: [null],
        homePostcode: [null],
      }),
      // T&Cs agreement is implicit through submitting the form.
    };

    this.creditForm = this.formBuilder.group(formGroups);

    const amountsGroup: any = this.creditForm.get('amounts');
    if (amountsGroup != null) {
      this.amountsGroup = amountsGroup;
    }

    const giftAidGroup: any = this.creditForm.get('giftAid');
    if (giftAidGroup != null) {
      this.giftAidGroup = giftAidGroup;
    }

    // Gift Aid home address fields are validated only if the donor's claiming Gift Aid.
    this.giftAidGroup.get('giftAid')?.valueChanges.subscribe(giftAidChecked => {
    if (giftAidChecked) {
      this.isOptedIntoGiftAid = true;
        // this.giftAidGroup.controls.homePostcode.setValidators(
        //   this.getHomePostcodeValidatorsWhenClaimingGiftAid(this.giftAidGroup.value.homeOutsideUK),
        // );
        // this.giftAidGroup.controls.homeAddress.setValidators([
        //   Validators.required,
        //   Validators.maxLength(255),
        // ]);
      } else {
        this.isOptedIntoGiftAid = false;
        // this.giftAidGroup.controls.homePostcode.setValidators([]);
        // this.giftAidGroup.controls.homeAddress.setValidators([]);
      }

      // this.giftAidGroup.controls.homePostcode.updateValueAndValidity();
      // this.giftAidGroup.controls.homeAddress.updateValueAndValidity();
    });
  }

  buyCredits(): void {
    this.isLoading = true;
    const idAndJWT = this.identityService.getIdAndJWT();
    if (idAndJWT !== undefined) {
      this.identityService.getFundingInstructions(idAndJWT?.id, idAndJWT.jwt).subscribe((response: FundingInstruction) => {
        this.isLoading = false;
        this.isPurchaseComplete = true;
        this.accountNumber = response.bank_transfer.financial_addresses[0].sort_code.account_number;
        this.sortCode = response.bank_transfer.financial_addresses[0].sort_code.sort_code;
        this.accountHolderName = response.bank_transfer.financial_addresses[0].sort_code.account_holder_name;
      });
    }
  }

  showLoginDialog() {
    const loginDialog = this.dialog.open(LoginModal);
    loginDialog.afterClosed().subscribe((data?: {id: string, jwt: string}) => {
      if (data && data.id) {
        this.loadAuthedPersonInfo(data.id, data.jwt);
      }
    });
  }

  customTip(): boolean {
    return this.amountsGroup.value.tipPercentage === 'Other';
  }

  onTipSelectorChanged(e: MatSelectChange) {
    if (e.value === 'Other') {
      this.creditForm.get('amounts')?.get('customTipAmount')?.addValidators(Validators.required);

    }

    else {
      this.creditForm.get('amounts')?.get('customTipAmount')?.removeValidators(Validators.required);
    }

    this.creditForm.get('amounts')?.get('customTipAmount')?.updateValueAndValidity();
  }

  giftAidAmount() : number {
    // Gift Aid on the tip only when buying credits!
    return this.calculatedTipAmount() * 0.25;
  }

  get creditAmountField() {
    if (!this.creditForm) {
      return undefined;
    }

    return this.creditForm.controls.amounts.get('creditAmount');
  }

  get customTipAmountField() {
    if (!this.creditForm) {
      return undefined;
    }

    return this.creditForm.controls.amounts.get('customTipAmount');
  }

  /**
  * @returns Amount without any £/$s
  */
  sanitiseCurrency(amount: string): number {
    return Number((amount || '0').replace('£', '').replace('$', ''));
  }

  calculatedTipAmount() : number {
    const unsanitisedCreditAmount = this.amountsGroup.value.creditAmount;

    if (!unsanitisedCreditAmount) {
      return 0;
    }

    if (this.customTip()) {
      const unsanitisedCustomTipAmount = this.amountsGroup.value.customTipAmount;
      if (unsanitisedCustomTipAmount) {
        return this.sanitiseCurrency(unsanitisedCustomTipAmount)
      }
      return 0;
    }

    const creditAmount: number = this.sanitiseCurrency(unsanitisedCreditAmount);
    const tipPercentage: number = this.amountsGroup.value.tipPercentage;
    return (creditAmount * (tipPercentage / 100));
  }

  private loadAuthedPersonInfo(id: string, jwt: string) {
    this.isLoading = true;
    this.identityService.get(id, jwt).subscribe((person: Person) => {
      this.isLoggedIn = true;
      this.isLoading = false;
      this.userFullName = person.first_name + ' ' + person.last_name;

      // this.personId = person.id; // Should mean donations are attached to the Stripe Customer.
      // this.personIsLoginReady = true;

      // // Pre-fill rarely-changing form values from the Person.
      // this.giftAidGroup.patchValue({
      //   homeAddress: person.home_address_line_1,
      //   homeOutsideUK: person.home_country_code !== 'GB',
      //   homePostcode: person.home_postcode,
      // });

      // this.paymentGroup.patchValue({
      //   firstName: person.first_name,
      //   lastName: person.last_name,
      //   emailAddress: person.email_address,
      // });

      // Load first saved Stripe card, if there are any.
      this.donationService.getPaymentMethods(id, jwt).subscribe((response: { data: PaymentMethod[] }) => {
        if (response.data.length > 0) {

          // console.log('Payment details: ' + JSON.stringify(response.data[0]));
          // this.stripePaymentMethodReady = true;
          // this.stripeFirstSavedMethod = response.data[0];

          // this.updateFormWithSavedCard();
        }
      });
    });
  }

}
