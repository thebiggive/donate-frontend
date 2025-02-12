import {isPlatformBrowser} from '@angular/common';
import {AfterContentInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatomoTracker} from 'ngx-matomo-client';
import {EMPTY} from 'rxjs';
import {debounceTime, distinctUntilChanged, startWith, switchMap} from 'rxjs/operators';

import {Campaign} from '../campaign.model';
import {CampaignService} from '../campaign.service';
import {DonationService} from '../donation.service';
import {DonorAccountService} from '../donor-account.service';
import {Donation, maximumDonationAmountForFundedDonation} from '../donation.model';
import {DonationCreatedResponse} from '../donation-created-response.model';
import {environment} from 'src/environments/environment';
import {FundingInstruction} from '../fundingInstruction.model';
import {GiftAidAddressSuggestion} from '../gift-aid-address-suggestion.model';
import {GiftAidAddress} from '../gift-aid-address.model';
import {IdentityService} from '../identity.service';
import {Person} from '../person.model';
import {AddressService} from '../address.service';
import {getCurrencyMinValidator} from '../validators/currency-min';
import {getCurrencyMaxValidator} from '../validators/currency-max';
import {Toast} from '../toast.service';
import {allChildComponentImports} from '../../allChildComponentImports';
import {ExactCurrencyPipe} from '../exact-currency.pipe';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatStepperModule} from '@angular/material/stepper';

/**
 * Support for topping up Stripe customer_balance via bank transfer. Only
 * available for GBP campaigns and UK donors for now.
 */
@Component({
  selector: 'app-transfer-funds',
  templateUrl: './transfer-funds.component.html',
  styleUrl: './transfer-funds.component.scss',
  standalone: true,
  imports: [
    ...allChildComponentImports,
    ExactCurrencyPipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    ReactiveFormsModule,
  ],
})
export class TransferFundsComponent implements AfterContentInit, OnInit {
  addressSuggestions: GiftAidAddressSuggestion[] = [];
  isLoading: boolean = false;
  isPurchaseComplete = false;
  isOptedIntoGiftAid = false;
  currency = '£';
  /** The Big Give campaign which receives any on-topup tips. */
  campaign: Campaign;
  donation?: Donation;
  creditForm: FormGroup;
  amountsGroup: FormGroup;
  giftAidGroup: FormGroup;
  marketingGroup: FormGroup;
  loadingAddressSuggestions = false;
  minimumCreditAmount = environment.minimumCreditAmount;
  maximumCreditAmount = environment.maximumCreditAmount;
  maximumDonationAmount = maximumDonationAmountForFundedDonation;
  showAddressLookup: boolean = true;
  sortCode?: string;
  accountNumber?: string;
  accountHolderName?: string;
  private initialTipSuggestedPercentage = 15;
  private postcodeRegExp = new RegExp('^([A-Z][A-HJ-Y]?\\d[A-Z\\d]? \\d[A-Z]{2}|GIR 0A{2})$');
  donor: Person | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private campaignService: CampaignService,
    private donationService: DonationService,
    private donorAccountService: DonorAccountService,
    private identityService: IdentityService,
    private matomoTracker: MatomoTracker,
    @Inject(PLATFORM_ID) private platformId: Object,
    private addressService: AddressService,
    private toast: Toast,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPerson();
    }

    const formGroups: {
      amounts: FormGroup,
      giftAid: FormGroup
      marketing: FormGroup,
    } = {
      amounts: this.formBuilder.group({
        creditAmount: new FormControl(
          null, {
            validators: [
              Validators.required,
              getCurrencyMinValidator(environment.minimumCreditAmount), // overrides the min amount to value from env file
              getCurrencyMaxValidator(environment.maximumCreditAmount),
              Validators.pattern('^[£$]?[0-9]+?(\\.00)?$'),
            ],
            updateOn: "blur",
          }),
        tipPercentage: new FormControl(this.initialTipSuggestedPercentage, {updateOn: "blur"}),
        customTipAmount: new FormControl(null, {
          validators: [
          // Explicitly enforce minimum custom tip amount of £0. This is already covered by the regexp
          // validation rule below, but it's good to add the explicit check for future-proofness
          getCurrencyMinValidator(), // no override, so custom tip amount min is £0 (default)
          // Below we validate the tip as a donation because when transfering funds, tips are set
          // set as real donations to a dedicated Big Give SF campaign.
          // See MAT-266 and the Slack thread linked in its description for more context.
          getCurrencyMaxValidator(maximumDonationAmountForFundedDonation),
          Validators.pattern('^[£$]?[0-9]+?(\\.00)?$'),
          ],
          updateOn: "blur",
        }),
      }),
      giftAid: this.formBuilder.group({
        giftAid: [null],
        homeAddress: [null],
        homeBuildingNumber: [null],
        homeOutsideUK: [null],
        homePostcode: [null],
      }),
      marketing: this.formBuilder.group( {
        optInTbgEmail: [null], // See also setConditionalValidators(); only required if no existing tip's pending.
      })
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

    this.marketingGroup = this.creditForm.get('marketing') as FormGroup<any>;

    // Gift Aid home address fields are validated only if the donor's claiming Gift Aid.
    this.giftAidGroup.get('giftAid')?.valueChanges.subscribe(giftAidChecked => {
    if (giftAidChecked) {
      this.isOptedIntoGiftAid = true;
        this.giftAidGroup.controls.homePostcode!.setValidators(
          this.getHomePostcodeValidatorsWhenClaimingGiftAid(this.giftAidGroup.value.homeOutsideUK),
        );
        this.giftAidGroup.controls.homeAddress!.setValidators([
          Validators.required,
          Validators.maxLength(255),
        ]);
      } else {
        this.isOptedIntoGiftAid = false;
        this.giftAidGroup.controls.homePostcode!.setValidators([]);
        this.giftAidGroup.controls.homeAddress!.setValidators([]);
      }

      this.giftAidGroup.controls.homePostcode!.updateValueAndValidity();
      this.giftAidGroup.controls.homeAddress!.updateValueAndValidity();
    });

    // get the tips campaign data on page load
    this.campaignService.getOneById(environment.creditTipsCampaign).subscribe(campaign => {
      this.campaign = campaign;
    });
  }

  ngAfterContentInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

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
        return this.addressService.getSuggestions(initialAddress);
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
    this.addressService.get(event.option.value.url).subscribe((address: GiftAidAddress) => {
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
    }, error => {
      console.log('Postcode resolve error', error);
    });
  }

  createAccount(): void {
    if (! this.donor) {
      throw new Error("Donor info not loaded");
    }
    this.isLoading = true;
    const idAndJWT = this.identityService.getIdAndJWT();
    if (idAndJWT !== undefined) {
      this.identityService.getFundingInstructions(idAndJWT?.id, idAndJWT.jwt).subscribe((response: FundingInstruction) => {
        this.isLoading = false;
        this.isPurchaseComplete = true;
        this.accountNumber = response.bank_transfer.financial_addresses[0]!.sort_code.account_number;
        this.sortCode = response.bank_transfer.financial_addresses[0]!.sort_code.sort_code;
        this.accountHolderName = response.bank_transfer.financial_addresses[0]!.sort_code.account_holder_name;
      });

      this.createAndFinaliseTipDonation();
    }
  }

  customTip(): boolean {
    return this.amountsGroup.value.tipPercentage === 'Other';
  }

  onTipSelectorChanged(e: MatSelectChange) {
    if (e.value === 'Other') {
      this.creditForm.get('amounts')?.get('customTipAmount')?.addValidators(Validators.required);
    } else {
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

    return this.creditForm.controls.amounts!.get('creditAmount');
  }

  get customTipAmountField() {
    if (!this.creditForm) {
      return undefined;
    }

    return this.creditForm.controls.amounts!.get('customTipAmount');
  }

  get totalToTransfer(): number {
    return parseFloat(this.creditAmountField?.value) + this.calculatedTipAmount();
  }

  /**
  * @returns Amount without any £/$s
  */
  sanitiseCurrency(amount: string): number {
    return Number((amount || '0').replace('£', '').replace('$', ''));
  }

  shouldShowGiftAidStep() {
    if (
      this.customTip() &&
      this.amountsGroup.value.customTipAmount &&
      this.sanitiseCurrency(this.amountsGroup.value.customTipAmount) === 0
    )
    {
      return false;
    }

    if (this.donorHasPendingTipBalance || this.donorHasRecentlyTipped) {
      return false;
    }

    return true;
  }

  /**
   * In whole currency unit, e.g. pounds. Always a whole number because Donation Fund tips are in fact donations / payment intents to BG,
   * and we don't support partial pounds for those for now.
   */
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

    return Math.floor(creditAmount * (tipPercentage / 100));
  }

  cancelPendingTips() {
    this.donationService.cancelDonationFundsToCampaign(environment.creditTipsCampaign).subscribe(() => {
      // Theoretically this could be multiple tips, but in practice almost always 0 or 1, so singular is the less confusing copy.
      this.toast.showSuccess('Pending tip cancelled. To continue, enter a new tip amount to support Big Give when you transfer, or 0.');
      this.loadPerson();
    });
  }

  /**
   * Amount in existing committed tips to be fulfilled, in minor units (i.e. pence),
   * currently just for GBP / UK bank transfers. 0 if donor's not yet loaded.
   */
  get pendingTipBalance(): number {
    return this.donor?.pending_tip_balance?.gbp || 0;
  }

  get donorHasPendingTipBalance(): boolean {
    return this.pendingTipBalance > 0;
  }

  get recentlyConfirmedTipsTotal(): number {
    return this.donor?.recently_confirmed_tips_total?.gbp || 0;
  }

  get donorHasRecentlyTipped(): boolean {
    return this.recentlyConfirmedTipsTotal > 0;
  }

  private loadPerson() {
    const idAndJWT = this.identityService.getIdAndJWT();
    if (idAndJWT !== undefined) {
      if (this.identityService.isTokenForFinalisedUser(idAndJWT.jwt)) {
        this.loadAuthedPersonInfo(idAndJWT.id, idAndJWT.jwt);
      }
    }
  }

  private loadAuthedPersonInfo(id: string, jwt: string) {
    this.isLoading = true;
    this.identityService.get(id, jwt, {withTipBalances: true}).subscribe((person: Person) => {
      this.isLoading = false;
      this.donor = person;
      this.identityService.loginStatusChanged.emit(true);

      this.setConditionalValidators();

      if (this.donorHasPendingTipBalance || this.donorHasRecentlyTipped) {
        this.amountsGroup.patchValue({
          customTipAmount: 0,
          tipPercentage: 0,
        });
        // Ensure form field for Gift Aid is off as it's N/A; this also turns off its validation and `isOptedIntoGiftAid`
        // as side effects.
        this.giftAidGroup.patchValue({
          giftAid: false,
        });
      } else {
        // Pre-fill rarely-changing form values from the Person.
        this.giftAidGroup.patchValue({
          homeAddress: person.home_address_line_1,
          homeOutsideUK: person.home_country_code !== null && person.home_country_code !== 'GB',
          homePostcode: person.home_postcode,
        });
      }
    });
  }

  private setConditionalValidators() {
    const tipFieldsAvailable = this.pendingTipBalance === 0;
    const validatorsForFieldsRequiredIfTipFieldsAvailable = tipFieldsAvailable ? [Validators.required] : [];

    this.marketingGroup.controls.optInTbgEmail!.setValidators(validatorsForFieldsRequiredIfTipFieldsAvailable);
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

  private createAndFinaliseTipDonation() {
    if (this.donor === undefined) {
      throw new Error("Cannot create donation without logged in donor");
    }

    // The donation amount to Big Give is whatever the user is 'tipping' in the Buy Credits form.
    const donationAmount = this.calculatedTipAmount();

    // If user didn't tip, OR if an existing tip's detected but we somehow have tip numbers
    // set, do not create a new tip.
    if (donationAmount <= 0 || this.donorHasPendingTipBalance || this.donorHasRecentlyTipped) {
      return;
    }

    const donation: Donation = {
      emailAddress: this.donor.email_address,
      firstName: this.donor.first_name,
      lastName: this.donor.last_name,
      charityId: this.campaign.charity.id,
      charityName: this.campaign.charity.name,
      countryCode: 'GB', // hard coded to GB only for now
      currencyCode: this.campaign.currencyCode || 'GBP',
      // IMPORTANT: donationAmount set as the tip value
      donationAmount: donationAmount,
      donationMatched: this.campaign.isMatched, // this should always be false
      giftAid: this.giftAidGroup.value.giftAid,
      matchedAmount: 0, // Tips are always unmatched
      matchReservedAmount: 0, // Tips are always unmatched
      optInCharityEmail: false,
      optInTbgEmail: this.marketingGroup.value.optInTbgEmail,
      pspMethodType: 'customer_balance',
      projectId: this.campaign.id,
      psp: 'stripe',
      tipAmount: 0,
      tipGiftAid: false,
    };

    if (this.giftAidGroup.value.giftAid) {
      donation.homePostcode = this.giftAidGroup.value.homeOutsideUK ? 'OVERSEAS' : this.giftAidGroup.value.homePostcode;
      donation.homeAddress = this.giftAidGroup.value.homeAddress;
      // Optional additional field to improve data alignment w/ HMRC when a lookup was used.
      donation.homeBuildingNumber = this.giftAidGroup.value.homeBuildingNumber || undefined;
    } else {
      donation.homePostcode = undefined;
      donation.homeAddress = undefined;
      donation.homeBuildingNumber = undefined;
    }

    if (this.donor.id) {
      donation.pspCustomerId = this.identityService.getPspId();
    }

    // No re-tries for create() where donors have only entered amounts. If the
    // server is having problem it's probably more helpful to fail immediately than
    // to wait until they're ~10 seconds into further data entry before jumping
    // back to the start.
    this.donationService.create(donation, this.donor.id, this.identityService.getJWT())
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
      this.matomoTracker.trackEvent(
        'donate_error',
        'credit_tip_donation_create_response_incomplete',
        `Missing expected response data creating new donation for campaign ${this.campaign.id}`,
      );

      return;
    }

    this.donationService.saveDonation(response);
    this.donationService.finaliseCashBalancePurchase(response.donation).subscribe((donation) => {
      this.donation = donation;
    });
  }

  private newDonationError(response: any) {
    let errorMessage: string;
    if (response.message) {
      errorMessage = `Could not create new donation for campaign ${this.campaign.id}: ${response.message}`;
    } else {
      errorMessage = `Could not create new donation for campaign ${this.campaign.id}: HTTP code ${response.status}`;
    }
    this.matomoTracker.trackEvent('donate_error', 'credit_tip_donation_create_failed', errorMessage);
    this.toast.showError('Could not prepare your tip; please try again later or contact us to investigate');
  }

  /**
   * We only check for GBP balances for now, as we only support UK bank transfers rn
   */
  protected get hasDonationFunds()
  {
    return this.donor?.cash_balance?.gbp;
  }
}

export const transferFundsPath = 'transfer-funds';
