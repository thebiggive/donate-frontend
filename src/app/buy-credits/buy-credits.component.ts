import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { DonationService } from '../donation.service';
import { IdentityService } from '../identity.service';
import { Person } from '../person.model';
import { environment } from 'src/environments/environment';
import { MatSelectChange } from '@angular/material/select';
import { FundingInstruction } from '../fundingInstruction.model';
import { GiftAidAddressSuggestion } from '../gift-aid-address-suggestion.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GiftAidAddress } from '../gift-aid-address.model';
import { PostcodeService } from '../postcode.service';
import { EMPTY } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Donation } from '../donation.model';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { DonationCreatedResponse } from '../donation-created-response.model';
import { AnalyticsService } from '../analytics.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { getCurrencyMinValidator } from '../validators/currency-min';
import { getCurrencyMaxValidator } from '../validators/currency-max';

@Component({
  selector: 'app-buy-credits',
  templateUrl: './buy-credits.component.html',
  styleUrls: ['./buy-credits.component.scss']
})
export class BuyCreditsComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;
  @ViewChild('idCaptcha') idCaptcha: RecaptchaComponent;
  addressSuggestions: GiftAidAddressSuggestion[] = [];
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  isPurchaseComplete = false;
  isOptedIntoGiftAid = false;
  currency = '£';
  campaign: Campaign;
  donation?: Donation;
  userFullName: string;
  creditForm: FormGroup;
  amountsGroup: FormGroup;
  giftAidGroup: FormGroup;
  loadingAddressSuggestions = false;
  minimumCreditAmount = environment.minimumCreditAmount;
  maximumCreditAmount = environment.maximumCreditAmount;
  maximumDonationAmount = environment.maximumDonationAmount;
  showAddressLookup: boolean = true;
  personId?: string;
  sortCode: string;
  accountNumber: string;
  accountHolderName: string;
  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;
  recaptchaSiteKey = environment.recaptchaSiteKey;
  private captchaCode?: string;
  private idCaptchaCode?: string;
  private initialTipSuggestedPercentage = 15;
  private postcodeRegExp = new RegExp('^([A-Z][A-HJ-Y]?\\d[A-Z\\d]? \\d[A-Z]{2}|GIR 0A{2})$');

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private analyticsService: AnalyticsService,
    private campaignService: CampaignService,
    private donationService: DonationService,
    private identityService: IdentityService,
    private postcodeService: PostcodeService,
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
          getCurrencyMinValidator(environment.minimumCreditAmount), // overrides the min amount to value from env file
          getCurrencyMaxValidator(environment.maximumCreditAmount),
          Validators.pattern('^[£$]?[0-9]+?(\\.00)?$'),
        ]],
        tipPercentage: [this.initialTipSuggestedPercentage],
        customTipAmount: [null, [
          // Explicitly enforce minimum custom tip amount of £0. This is already covered by the regexp
          // validation rule below, but it's good to add the explicit check for future-proofness
          getCurrencyMinValidator(), // no override, so custom tip amount min is £0 (default)
          // Below we validate the tip as a donation because when buying donation credits, tips are set
          // set as real donations to a dedicated Big Give SF campaign.
          // See MAT-266 and the Slack thread linked it its description for more context.
          getCurrencyMaxValidator(environment.maximumDonationAmount),
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
        this.giftAidGroup.controls.homePostcode.setValidators(
          this.getHomePostcodeValidatorsWhenClaimingGiftAid(this.giftAidGroup.value.homeOutsideUK),
        );
        this.giftAidGroup.controls.homeAddress.setValidators([
          Validators.required,
          Validators.maxLength(255),
        ]);
      } else {
        this.isOptedIntoGiftAid = false;
        this.giftAidGroup.controls.homePostcode.setValidators([]);
        this.giftAidGroup.controls.homeAddress.setValidators([]);
      }

      this.giftAidGroup.controls.homePostcode.updateValueAndValidity();
      this.giftAidGroup.controls.homeAddress.updateValueAndValidity();
    });

    // get the tips campaign data on page load
    this.campaignService.getOneById(environment.creditTipsCampaign).subscribe(campaign => {
      this.campaign = campaign;
    });
  }

  ngAfterContentInit() {
    const observable = this.giftAidGroup.get('homeAddress')?.valueChanges.pipe(
      startWith(''),
      // https://stackoverflow.com/a/51470735/2803757
      debounceTime(400),
      distinctUntilChanged(),
      // switchMap *seems* like the best operator to swap out the Observable on the value change
      // itself and swap in the observable on a lookup. But I'm not an expert with RxJS! I think/
      // hope this may also cancel previous outstanding lookup resolutions that are in flight?
      // https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap
      switchMap((initialAddress: any) => {
        if (!initialAddress) {
          return EMPTY;
        }

        this.loadingAddressSuggestions = true;
        return this.postcodeService.getSuggestions(initialAddress);
      }),
    ) || EMPTY;

    observable.subscribe(suggestions => {
      this.loadingAddressSuggestions = false;
      this.addressSuggestions = suggestions;
    });
  }

  summariseAddressSuggestion(suggestion: GiftAidAddressSuggestion | string | undefined): string {
    // Patching the `giftAidGroup` seems to lead to a re-evaluation via this method, even if we use
    // `{emit: false}`. So it seems like the only safe way for the slightly hacky autocomplete return
    // approach of returning an object, then resolving from it, to work, is to explicitly check which
    // type this field has got before re-summarising it.
    if (typeof suggestion === 'string') {
      return suggestion;
    }

    return suggestion?.address || '';
  }

  addressChosen(event: MatAutocompleteSelectedEvent) {
    // Autocomplete's value.url should be an address we can /get.
    this.postcodeService.get(event.option.value.url).subscribe((address: GiftAidAddress) => {
      const addressParts = [address.line_1];
      if (address.line_2) {
        addressParts.push(address.line_2);
      }
      addressParts.push(address.town_or_city);

      this.giftAidGroup.patchValue({
        homeAddress: addressParts.join(', '),
        homeBuildingNumber: address.building_number,
        homePostcode: address.postcode,
      });
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

      this.createTipDonation();
    }
  }

  showLoginDialog() {
    const loginDialog = this.dialog.open(LoginModalComponent);
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

  captchaDonationReturn(captchaResponse: string) {
    if (captchaResponse === null) {
      // Ensure no other callback tries to use the old captcha code, and will re-execute
      // the catcha to get a new one as needed instead.
      this.captchaCode = undefined;
      return;
    }

    this.captchaCode = captchaResponse;
  }

  captchaIdentityReturn(captchaResponse: string) {
    if (captchaResponse === null) {
      // Ensure no other callback tries to use the old captcha code, and will re-execute
      // the catcha to get a new one as needed instead.
      this.idCaptchaCode = undefined;
      return;
    }

    this.idCaptchaCode = captchaResponse;
  }

  async stepChanged(event: StepperSelectionEvent)  {
    if (event.previouslySelectedStep.label === 'Your Donation Credits') {
      this.captcha.execute(); // Prepare for a non-Person-linked donation which needs a Donation captcha.
      this.idCaptcha.execute(); // Prepare for a Person create which needs an Identity captcha.
    }
  }

  private loadAuthedPersonInfo(id: string, jwt: string) {
    this.isLoading = true;
    this.identityService.get(id, jwt).subscribe((person: Person) => {
      this.isLoggedIn = true;
      this.isLoading = false;
      this.userFullName = person.first_name + ' ' + person.last_name;

      this.personId = person.id; // Should mean donations are attached to the Stripe Customer.

      // Pre-fill rarely-changing form values from the Person.
      this.giftAidGroup.patchValue({
        homeAddress: person.home_address_line_1,
        homeOutsideUK: person.home_country_code !== 'GB',
        homePostcode: person.home_postcode,
      });
      
    });
  }

  private getHomePostcodeValidatorsWhenClaimingGiftAid(homeOutsideUK: boolean) {
    if (homeOutsideUK) {
      return [];
    }

    return [
      Validators.required,
      Validators.pattern(this.postcodeRegExp),
    ];
  }


  private createTipDonation() {
    const donation: Donation = {
      charityId: this.campaign.charity.id,
      charityName: this.campaign.charity.name,
      countryCode: 'GB', // hard coded to GB only for now
      // Captcha is set on Person (only) if we are making a Person + using the resulting
      // token to authenticate the donation create.
      creationRecaptchaCode: environment.identityEnabled ? undefined : this.captchaCode,
      currencyCode: this.campaign.currencyCode || 'GBP',
      // IMPORTANT: donationAmount set as the tip value
      donationAmount: this.calculatedTipAmount(),
      donationMatched: this.campaign.isMatched, // this should always be false
      feeCoverAmount: this.sanitiseCurrency(this.amountsGroup.value.feeCoverAmount),
      matchedAmount: 0, // Tips are always unmatched
      matchReservedAmount: 0, // Tips are always unmatched
      paymentMethodType: 'customer_balance',
      projectId: this.campaign.id,
      psp: 'stripe',
      tipAmount: this.sanitiseCurrency(this.amountsGroup.value.tipAmount),
    };

    if (environment.identityEnabled && this.personId) {
      donation.pspCustomerId = this.identityService.getPspId();
    }

    this.createDonation(donation);
  }

  /**
   * Creates a Donation itself. Both success and error callbacks should unconditionally set `creatingDonation` false.
   */
  private createDonation(donation: Donation) {
    // No re-tries for create() where donors have only entered amounts. If the
    // server is having problem it's probably more helpful to fail immediately than
    // to wait until they're ~10 seconds into further data entry before jumping
    // back to the start.
    this.donationService.create(donation, this.personId, this.identityService.getJWT())
    .subscribe({
      next: this.newDonationSuccess.bind(this),
      error: this.newDonationError.bind(this),
    });
  }

  private newDonationSuccess(response: DonationCreatedResponse) {
    const createResponseMissingData = (
      !response.donation.charityId ||
      !response.donation.donationId ||
      !response.donation.projectId
    );
    if (createResponseMissingData) {
      this.analyticsService.logError(
        'donation_create_response_incomplete',
        `Missing expected response data creating new donation for campaign ${this.campaign.id}`,
      );

      return;
    }

    this.donationService.saveDonation(response.donation, response.jwt);
    this.donation = response.donation; // Simplify update() while we're on this page.

    this.analyticsService.logAmountChosen(
      response.donation.donationAmount,
      this.campaign.id,
      [],
      this.campaign.currencyCode,
    );

    if (response.donation.tipAmount > 0) {
      this.analyticsService.logTipAmountChosen(
        response.donation.tipAmount,
        this.campaign.id,
        this.campaign.currencyCode,
      );
    }

    this.analyticsService.logCheckoutStep(1, this.campaign, this.donation);
  }

  private newDonationError(response: any) {
    let errorMessage: string;
    if (response.message) {
      errorMessage = `Could not create new donation for campaign ${this.campaign.id}: ${response.message}`;
    } else {
      errorMessage = `Could not create new donation for campaign ${this.campaign.id}: HTTP code ${response.status}`;
    }
    this.analyticsService.logError('donation_create_failed', errorMessage);
  }

}