import {isPlatformBrowser} from '@angular/common';
import {AfterContentInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatDialog} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import {MatomoTracker} from 'ngx-matomo';
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
import {LoginModalComponent} from '../login-modal/login-modal.component';
import {Person} from '../person.model';
import {PostcodeService} from '../postcode.service';
import {RegisterModalComponent} from '../register-modal/register-modal.component';
import {getCurrencyMinValidator} from '../validators/currency-min';
import {getCurrencyMaxValidator} from '../validators/currency-max';

@Component({
  selector: 'app-transfer-funds',
  templateUrl: './transfer-funds.component.html',
  styleUrls: ['./transfer-funds.component.scss'],
})
export class TransferFundsComponent implements AfterContentInit, OnInit {
  addressSuggestions: GiftAidAddressSuggestion[] = [];
  isLoading: boolean = false;
  isPurchaseComplete = false;
  isOptedIntoGiftAid = false;
  currency = '£';
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
    private postcodeService: PostcodeService,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const idAndJWT = this.identityService.getIdAndJWT();
      if (idAndJWT !== undefined) {
        if (this.identityService.isTokenForFinalisedUser(idAndJWT.jwt)) {
          this.loadAuthedPersonInfo(idAndJWT.id, idAndJWT.jwt);
        }
      }
    }

    const formGroups: {
      amounts: FormGroup,
      giftAid: FormGroup
      marketing: FormGroup,
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
          // Below we validate the tip as a donation because when transfering funds, tips are set
          // set as real donations to a dedicated Big Give SF campaign.
          // See MAT-266 and the Slack thread linked in its description for more context.
          getCurrencyMaxValidator(maximumDonationAmountForFundedDonation),
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
      marketing: this.formBuilder.group( {
        optInTbgEmail: [null, [Validators.required]],
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

      this.donorAccountService.createAccount(this.donor).subscribe({
        next: () => {console.log("Account created")},
        error () {}, // no need to do anything, possibly matchbot just doesn't have the account creation route yet.
      });

      this.createAndFinaliseTipDonation();
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

  showRegisterDialog() {
    const registerDialog = this.dialog.open(RegisterModalComponent);
    registerDialog.afterClosed().subscribe((data?: {id: string, jwt: string}) => {
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

  logout() {
    this.donor = undefined;
    this.isLoading = false;

    this.accountHolderName = undefined;
    this.accountNumber = undefined;
    this.sortCode = undefined;

    this.isPurchaseComplete = false;
    this.creditForm.reset();
    this.identityService.clearJWT();
  }

  private loadAuthedPersonInfo(id: string, jwt: string) {
    this.isLoading = true;
    this.identityService.get(id, jwt, {withTipBalances: true}).subscribe((person: Person) => {
      this.isLoading = false;
      this.donor = person;

      if ((this.donor?.pending_tip_balance?.gbp || 0) > 0) {
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

    // If user fills Buy Credits form with a £0 tip to Big Give, then do NOT attempt to create
    // the donation, because MatchBot will respond with an error saying donationAmount is a
    // required field. DON-689.
    if (donationAmount <= 0) {
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
      feeCoverAmount: 0,
      giftAid: this.giftAidGroup.value.giftAid,
      matchedAmount: 0, // Tips are always unmatched
      matchReservedAmount: 0, // Tips are always unmatched
      optInCharityEmail: false,
      optInTbgEmail: this.marketingGroup.value.optInTbgEmail,
      paymentMethodType: 'customer_balance',
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

    this.donationService.saveDonation(response.donation, response.jwt);
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
  }
}
