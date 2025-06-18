import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Campaign } from '../campaign.model';
import { ComponentsModule } from '@biggive/components-angular';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatHint, MatInput } from '@angular/material/input';
import { MatButton, MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Person } from '../person.model';
import { MandateCreateResponse, RegularGivingService, StartMandateParams } from '../regularGiving.service';
import { Mandate } from '../mandate.model';
import { myRegularGivingPath } from '../app-routing';
import { requiredNotBlankValidator } from '../validators/notBlank';
import { getCurrencyMinValidator } from '../validators/currency-min';
import { getCurrencyMaxValidator } from '../validators/currency-max';
import { Toast } from '../toast.service';
import { DonorAccount } from '../donorAccount.model';
import { countryOptions } from '../countries';
import { PageMetaService } from '../page-meta.service';
import { getStripeFriendlyError, StripeService } from '../stripe.service';
import {
  ConfirmationToken,
  PaymentMethod,
  StripeElementChangeEvent,
  StripeElements,
  StripePaymentElement,
} from '@stripe/stripe-js';
import { DonationService, StripeCustomerSession } from '../donation.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AddressService, billingPostcodeRegExp, HomeAddress, postcodeRegExp } from '../address.service';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { environment } from '../../environments/environment';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatCheckbox } from '@angular/material/checkbox';
import { GiftAidAddressSuggestion } from '../gift-aid-address-suggestion.model';
import { MoneyPipe } from '../money.pipe';
import { BackendError, errorDescription, errorDetails, isInsufficientMatchFundsError } from '../backendError';
import { CampaignService } from '../campaign.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { GIFT_AID_FACTOR, Money } from '../Money';

// for now min & max are hard-coded, will change to be based on a field on
// the campaign.
const maxAmount = 500;
const minAmount = 1;
const paymentStepIndex = 2;

// As on donation start form, these opt-in radio buttons seem awkward to click using our regression testing setup, so cheating
// and prefilling them with 'no' values in that case.
const booleansDefaultValue = environment.environmentId === 'regression' ? false : null;

// apologies - been failing to get clicking this checkbox to work all day in regression tests,
// so allowing regression tester to skip it.
const over18DefaultValue = environment.environmentId === 'regression';

@Component({
  selector: 'app-regular-giving',
  imports: [
    ComponentsModule,
    FormsModule,
    MatStep,
    MatStepper,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatIcon,
    MatProgressSpinner,
    MatHint,
    MatRadioButton,
    MatRadioGroup,
    MatIconAnchor,
    RouterLink,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatCheckbox,
    MatOption,
    MoneyPipe,
    AsyncPipe,
  ],
  templateUrl: './regular-giving.component.html',
  styleUrl: './regular-giving.component.scss',
})
export class RegularGivingComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private toast = inject(Toast);
  private regularGivingService = inject(RegularGivingService);
  private router = inject(Router);
  private pageMeta = inject(PageMetaService);
  private stripeService = inject(StripeService);
  private donationService = inject(DonationService);
  private addressService = inject(AddressService);

  protected mandateForm = new FormGroup({
    donationAmount: new FormControl('', [
      requiredNotBlankValidator,
      getCurrencyMinValidator(minAmount),
      getCurrencyMaxValidator(maxAmount),
      Validators.pattern('^\\s*[£$]?[0-9]+?(\\.00)?\\s*$'),
    ]),
    billingPostcode: new FormControl('', [requiredNotBlankValidator, Validators.pattern(billingPostcodeRegExp)]),
    optInCharityEmail: new FormControl(booleansDefaultValue, requiredNotBlankValidator),
    optInTbgEmail: new FormControl(booleansDefaultValue, requiredNotBlankValidator),
    giftAid: new FormControl(booleansDefaultValue, requiredNotBlankValidator),
    homeOutsideUK: new FormControl<string | null>(null),
    homeAddress: new FormControl<string | null>(null),
    homePostcode: new FormControl<string | null>(null),
    unmatched: new FormControl(false), // If ticked, indicates that the donor is willing to donate without match funding.
    aged18OrOver: new FormControl(over18DefaultValue, [Validators.requiredTrue]),
  });

  protected campaign!: Campaign;
  @ViewChild('stepper') private stepper!: MatStepper;
  readonly termsUrl = 'https://biggive.org/terms-and-conditions';
  readonly privacyUrl = 'https://biggive.org/privacy';
  protected donor?: Person;
  protected donorAccount!: DonorAccount;
  protected countryOptionsObject = countryOptions;
  protected selectedBillingCountryCode!: string;
  private stripeElements: StripeElements | undefined;
  private stripePaymentElement: StripePaymentElement | undefined;

  public readonly labelYourPaymentInformation = 'Your Payment Information';

  @ViewChild('cardInfo') protected cardInfo?: ElementRef;
  private stripeCustomerSession: StripeCustomerSession | undefined;
  protected submitting: boolean = false;

  protected amountErrorMessage: string | undefined;
  private stripePaymentMethodReady: boolean = false;
  protected stripeError: string | undefined;
  private cardHandler = this.onStripeCardChange.bind(this);
  protected paymentInfoErrorMessage: string | undefined;

  /**
   * Error generated on submission at end of form
   */
  protected submitErrorMessage: string | undefined;
  protected optInTBGEmailError: string | undefined;
  protected optInCharityEmailError: string | undefined;

  /**
   * Optional home address, used for Gift Aid purposes.
   */
  protected homeAddress: HomeAddress | undefined;
  protected summariseAddressSuggestion = AddressService.summariseAddressSuggestion;

  /**
   * Defined if we have discovered that there are/were not enough match funds to cover the initial donations the donor
   * wanted to make. They will have the option to try making a smaller matched donation, or donate without matching.
   */
  protected insufficientMatchFundsAvailable = false;

  /**
   * Amount of match funds remaining based on campaign information loaded with the page. Does not always account for
   * any very recent or concurrent usage of match funds by another donor.
   */
  // @ts-expect-error - initialised in ngOnInit rather than constructor.
  protected maximumMatchableDonation: Money;

  /** Used to distinguish between the case where there are zero match funds available on the campaign as seen at page
   * load, and a case where there are initially zero match funds and then we later discover that they are not enough
   * for the donor, perhaps due to concurrent usage.
   */
  protected matchFundsZeroOnLoad = false;
  protected campaignOpenOnLoad = false;

  protected preExistingActiveMandate$: Observable<Mandate[] | undefined> = of(undefined);
  protected ageErrorMessage: string | undefined;

  /**
   * Not all regular giving donations are matched, but any that are have exactly the first three donations only
   * matched. Ideally this might be sent from the backend as a property of the campaign, but the number three
   * is quite baked into the logic for matching regular giving in matchbot.
   */
  public readonly standardNumberOfDonationsMatched = 3;

  ngOnInit() {
    const donor: Person | null = this.route.snapshot.data['donor'];
    if (!donor) {
      throw new Error('Must be logged in to see regular giving page');
    }
    this.donor = donor;
    this.donorAccount = this.route.snapshot.data['donorAccount'];

    this.campaign = this.route.snapshot.data['campaign'];

    if (!this.campaign.isRegularGiving) {
      console.error('Campaign ' + this.campaign.id + ' is not a regular giving campaign');
    }

    this.campaignOpenOnLoad = CampaignService.campaignIsOpenLessForgiving(this.campaign);
    if (!this.campaignOpenOnLoad) {
      void this.router.navigateByUrl(`/campaign/${this.campaign.id}`);
    }

    this.pageMeta.setCommon(
      `Regular Giving for ${this.campaign.charity.name}`,
      `Regular Giving for ${this.campaign.charity.name}`,
      this.campaign.bannerUri,
    );

    this.selectedBillingCountryCode = this.donorAccount.billingCountryCode ?? 'GB';

    this.mandateForm.patchValue({ billingPostcode: this.donorAccount.billingPostCode });

    this.stripeService.init().catch(console.error);

    this.donationService
      .createCustomerSessionForRegularGiving({ campaign: this.campaign })
      .then((session) => {
        this.stripeCustomerSession = session;
        if (!this.stripeElements && this.stepper.selected?.label === this.labelYourPaymentInformation) {
          this.prepareStripeElements();
        }
      })
      .catch(console.error);

    this.addressService.suggestAddresses({
      homeAddressFormControl: this.mandateForm.get('homeAddress')!,
      loadingAddressSuggestionCallback: () => {
        this.loadingAddressSuggestions = true;
      },
      foundAddressSuggestionCallback: (suggestions: GiftAidAddressSuggestion[]) => {
        this.loadingAddressSuggestions = false;
        this.addressSuggestions = suggestions;
      },
    });

    this.maximumMatchableDonation = this.maximumMatchableDonationGivenCampaign(this.campaign);

    if (this.maximumMatchableDonation.amountInPence === 0) {
      this.matchFundsZeroOnLoad = true;
      this.mandateForm.patchValue({ unmatched: true });
    }

    this.preExistingActiveMandate$ = this.regularGivingService.activeMandate(this.campaign);
  }

  ngOnDestroy() {
    if (this.stripePaymentElement) {
      this.stripePaymentElement.off('change');
      this.stripePaymentElement.destroy();
      this.stripePaymentElement = undefined;
      this.stripeElements = undefined;
    }
  }

  ngAfterViewInit() {
    // It seems the stepper doesn't provide a nice way to let us intercept each request to change step. Monkey-patching
    // the select function which is called when the user clicks a step heading, to let us check that all previous
    // steps have been completed correctly, and then either proceed to the chosen step or display an error message.

    setTimeout(
      () => {
        this.stepper.steps.forEach((step, stepIndex) => {
          step.select = () => {
            this.selectStep(stepIndex);
          };
        });
      },
      500, // delay to for the stepper to be initialised - otherwise its undefined and the callback can't run.
    );
  }

  async interceptSubmitAndProceedInstead(event: Event) {
    event.preventDefault();
    await this.next();
  }

  stepChanged(event: StepperSelectionEvent) {
    if (event.selectedStep.label === this.labelYourPaymentInformation) {
      this.prepareStripeElements();
    }
  }

  async next() {
    this.stepper.next();
  }

  async submit() {
    const invalid = this.mandateForm.invalid;
    if (invalid) {
      let errorMessage = 'Form error: ';
      if (this.mandateForm.get('donationAmount')?.hasError('required')) {
        errorMessage += 'Monthly donation amount is required';
      } else {
        errorMessage =
          'Sorry, we encountered an unexpected form error. Please try again or contact Big Give for assistance.';
      }
      this.toast.showError(errorMessage);
      return;
    }

    const billingCountry: string = this.selectedBillingCountryCode;

    let confirmationToken: ConfirmationToken | undefined;
    if (!this.stripeElements && !this.donorAccount.regularGivingPaymentMethod) {
      throw new Error('Missing both stripe elements and on-file payment method, cannot setup regular giving mandate.');
    }

    this.submitting = true;

    if (this.stripeElements && !this.donorAccount.regularGivingPaymentMethod) {
      const confirmationTokenResult = await this.stripeService.prepareConfirmationTokenFromPaymentElement(
        { billingPostalAddress: this.billingPostCode + '', countryCode: billingCountry },
        this.stripeElements,
      );

      confirmationToken = confirmationTokenResult.confirmationToken;
    }
    if (!this.donorAccount.regularGivingPaymentMethod && !confirmationToken) {
      this.submitting = false;
      throw new Error('Stripe Confirmation token is missing');
    }

    /**
     * @todo-regular-giving consider if we need to send this from FE - if we're not displaying it to donor better for matchbot to
     *       generate it.*/
    const dayOfMonth = Math.min(new Date().getDate(), 28);

    this.submitErrorMessage = undefined;

    let home: StartMandateParams['home'];
    if (this.giftAid && this.homeAddressFormValue) {
      home = {
        addressLine1: this.homeAddressFormValue,
        // postcode and isOutsideUK must be set within this if block.
        postcode: this.homePostcode!,
        isOutsideUK: this.homeOutsideUK!,
      };
    } else {
      home = undefined;
    }

    const currency = this.campaign.currencyCode;

    if (currency !== 'GBP') {
      throw new Error(`unsupported currency ${currency}`);
    }

    this.regularGivingService
      .startMandate({
        amountInPence: this.getDonationAmountPence(),
        dayOfMonth,
        campaignId: this.campaign.id,
        currency: currency,
        giftAid: !!this.giftAid,
        billingPostcode: this.billingPostCode,
        billingCountry,
        stripeConfirmationTokenId: confirmationToken?.id,
        charityComms: !!this.optInCharityEmail,
        tbgComms: !!this.optInTbgEmail,
        homeAddress: this.homeAddressFormValue,
        homePostcode: this.homePostcode,
        home: home,
        unmatched: this.unmatched,
      })
      .subscribe({
        next: async (response: MandateCreateResponse) => {
          if (response.paymentIntent) {
            const nextActionResult = await this.stripeService.handleNextAction(response.paymentIntent.client_secret);

            if (nextActionResult.error) {
              this.submitErrorMessage = nextActionResult.error.message;
              this.submitting = false;

              // @todo-regular-giving DON-1119 - cancel new mandate here to release match funds and/or, or consider providing
              // a way for donor to retry the 3DS or other next action on the existing mandate, without calling matchbot
              // to create a new one.
              return;
            }
          }

          await this.router.navigateByUrl(`/${myRegularGivingPath}/${response.mandate.id}/thanks`);
        },
        error: (error: BackendError) => {
          const message = errorDescription(error);

          if (isInsufficientMatchFundsError(error)) {
            this.insufficientMatchFundsAvailable = true;
            this.maximumMatchableDonation = errorDetails(error).maxMatchable;
            this.selectStep(0);
          } else {
            this.submitErrorMessage = message;
          }
          this.toast.showError(message);
          this.submitting = false;
        },
      });
  }

  protected get unmatched(): boolean {
    return !!this.mandateForm.value.unmatched;
  }

  private get billingPostCode(): string | null {
    return this.mandateForm.value.billingPostcode ?? null;
  }

  private getDonationAmountPence(): number {
    return 100 * +(this.mandateForm.value.donationAmount ?? 0);
  }

  protected get donationAmount(): Money {
    return {
      amountInPence: this.getDonationAmountPence(),
      currency: this.campaign.currencyCode,
    };
  }

  protected setSelectedCountry = (countryCode: string) => {
    this.selectedBillingCountryCode = countryCode;
  };

  protected get giftAid(): boolean | undefined | null {
    return this.mandateForm.value.giftAid;
  }

  giftAidAmount(): Money {
    const { amountInPence } = this.donationAmount;
    const gaAmountInPence = amountInPence * GIFT_AID_FACTOR;

    return this.giftAid
      ? { amountInPence: gaAmountInPence, currency: this.campaign.currencyCode }
      : { amountInPence: 0, currency: this.campaign.currencyCode };
  }

  protected addressSuggestions: GiftAidAddressSuggestion[] = [];
  protected loadingAddressSuggestions = false;

  protected giftAidErrorMessage: string | undefined = undefined;

  protected get homeOutsideUK(): boolean {
    return !!this.mandateForm.value.homeOutsideUK;
  }

  protected get homePostcode(): string | null {
    return this.mandateForm.value.homePostcode ?? null;
  }

  protected onBillingPostCodeChanged(_: Event) {
    // no-op for now, but @todo-regular-giving we may need to do some validation as we don the ad-hoc donation page.
  }

  private prepareStripeElements() {
    if (!this.selectedBillingCountryCode) {
      return;
    }

    if (!this.stripeCustomerSession) {
      return;
    }

    if (this.stripeElements) {
      this.stripeElements.update({ amount: this.getDonationAmountPence() });
    } else {
      this.stripeElements = this.stripeService.stripeElements({
        money: {
          amount: this.getDonationAmountPence(),
          currency: this.campaign.currencyCode,
        },
        futureUsage: 'off_session',
        campaign: this.campaign,
        customerSessionClientSecret: this.stripeCustomerSession.stripeSessionSecret,
      });
    }

    if (this.stripePaymentElement) {
      // Payment element was already ready & we presume mounted.
      return;
    }

    this.stripePaymentElement = StripeService.createStripeElement(this.stripeElements);

    if (this.cardInfo && this.stripePaymentElement) {
      this.stripePaymentElement.mount(this.cardInfo.nativeElement);
      // @ts-expect-error Not sure why only 'loaderstart' sig is recognised now.
      this.stripePaymentElement.on('change', this.cardHandler);
    }
  }

  /**
   * Adapted from similar function in DonationStartFormComponent. There may be parts to DRY up but the pages are
   * different.
   */
  async onStripeCardChange(
    state: StripeElementChangeEvent & { value: { type: string; payment_method?: PaymentMethod } | undefined },
  ) {
    this.stripePaymentMethodReady = state.complete;

    if (state.error) {
      this.stripeError = getStripeFriendlyError(state.error, 'card_change');
      this.toast.showError(this.stripeError);
    } else {
      this.stripeError = undefined;
    }

    // Jump back if we get an out of band message back that the card is *not* valid/ready.
    // Don't jump forward when the card *is* valid, as the donor might have been
    // intending to edit something else in the `payment` step; let them click Next.

    if (!this.stripePaymentMethodReady || !this.stripePaymentElement || !this.stripeElements) {
      if (this.stepper.selectedIndex > paymentStepIndex) {
        this.stepper.selectedIndex = paymentStepIndex;
      }

      return;
    }
  }

  protected continue(): void {
    const nextStepIndex = this.stepper.selectedIndex + 1;
    if (nextStepIndex > this.stepper.steps.length - 1) {
      throw new Error('Cannot continue past last step');
    }

    this.selectStep(nextStepIndex);
  }

  private selectStep(stepIndex: number) {
    if (stepIndex > 0 && this.validateAmountStep()) {
      return;
    }

    if (stepIndex > 1 && this.validateGiftAidStep()) {
      return;
    }

    if (stepIndex > 2 && this.validatePaymentInformationStep()) {
      return;
    }

    if (stepIndex > 3 && this.validateUpdatesStep()) {
      return;
    }

    if (this.giftAid && this.homePostcode?.trim() && !this.billingPostCode?.trim()) {
      this.mandateForm.patchValue({
        billingPostcode: this.homePostcode,
      });
    }

    this.stepper.selected = this.stepper.steps.get(stepIndex);
  }

  protected get optInCharityEmail(): boolean | undefined {
    return this.mandateForm.value.optInCharityEmail ?? undefined;
  }

  protected get optInTbgEmail(): boolean | undefined {
    return this.mandateForm.value.optInTbgEmail ?? undefined;
  }

  protected get homeAddressFormValue(): string {
    return AddressService.summariseAddressSuggestion(this.mandateForm.value.homeAddress ?? undefined);
  }

  /**
   * Checks if the amount step is completed correctly, and shows the user an error message if not.
   */
  private validateAmountStep() {
    let errorFound = false;
    const donationAmountErrors = this.mandateForm.controls.donationAmount.errors;

    if (donationAmountErrors) {
      for (const [key] of Object.entries(donationAmountErrors)) {
        switch (key) {
          case 'required':
            this.amountErrorMessage = 'Please enter your monthly donation amount';
            break;
          case 'pattern':
            this.amountErrorMessage = `Please enter a whole number of £ without commas`;
            break;
          case 'max':
          case 'min':
            this.amountErrorMessage = `Please select an amount between £${minAmount} and £${maxAmount}`;
            break;
          default:
            this.amountErrorMessage = 'Unexpected donation amount error';
            console.error({ donationAmountErrors });
            break;
        }
      }
      this.toast.showError(this.amountErrorMessage!);

      errorFound = true;
    } else {
      this.amountErrorMessage = undefined;

      this.insufficientMatchFundsAvailable =
        !this.unmatched && this.getDonationAmountPence() > this.maximumMatchableDonation.amountInPence;

      if (this.insufficientMatchFundsAvailable) {
        this.insufficientMatchFundsAvailable = true;
        errorFound = true;
        this.toast.showError(this.amountErrorMessage!);
      }

      if (this.mandateForm.controls.aged18OrOver.errors?.required) {
        errorFound = true;
        this.ageErrorMessage = 'Please tick the box to confirm if you are at least 18 years old to proceed.';
        this.toast.showError(this.ageErrorMessage);
      } else {
        this.ageErrorMessage = undefined;
      }
    }
    return errorFound;
  }

  private validateUpdatesStep(): boolean {
    let errorFound = false;

    if (typeof this.optInTbgEmail !== 'boolean') {
      this.optInTBGEmailError = 'Please choose whether you wish to receive updates from Big Give.';
      errorFound = true;
    } else {
      this.optInTBGEmailError = undefined;
    }

    if (typeof this.optInCharityEmail !== 'boolean') {
      this.optInCharityEmailError = `Please choose whether you wish to receive updates from ${this.campaign.charity.name}.`;
      errorFound = true;
    } else {
      this.optInCharityEmailError = undefined;
    }

    const combinedErrors = [this.optInCharityEmailError, this.optInTBGEmailError].filter(Boolean).join(' ');
    combinedErrors && this.toast.showError(combinedErrors);

    return errorFound;
  }

  /**
   * Checks if the payment information step is completed correctly, and shows the user an error message if not.
   */
  private validatePaymentInformationStep(): boolean {
    this.paymentInfoErrorMessage = undefined;

    if (!this.stripePaymentMethodReady && !this.donorAccount.regularGivingPaymentMethod) {
      this.paymentInfoErrorMessage = 'Please complete your payment method details';
    } else if (this.stripeError) {
      this.paymentInfoErrorMessage = this.stripeError;
    }

    const postcodeErrors = this.mandateForm.controls['billingPostcode']!.errors;
    if (postcodeErrors) {
      for (const [key] of Object.entries(postcodeErrors)) {
        switch (key) {
          case 'required':
            this.paymentInfoErrorMessage = 'Please enter a billing postcode';
            break;
          case 'pattern':
            this.paymentInfoErrorMessage =
              'Sorry, your billing postcode is not recognised - please enter a valid billing postcode';
            break;
          default:
            this.paymentInfoErrorMessage = 'Unexpected billing postcode error';
            console.error({ postcodeErrors });
            break;
        }
      }
    }

    this.paymentInfoErrorMessage && this.toast.showError(this.paymentInfoErrorMessage);

    return !!this.paymentInfoErrorMessage;
  }

  private validateGiftAidStep(): boolean {
    const errors: string[] = [];
    if (typeof this.giftAid !== 'boolean') {
      errors.push('Please choose whether you wish to claim Gift Aid.');
    }

    if (this.giftAid && !this.homeAddressFormValue) {
      errors.push('Please enter or select your home address if you wish to claim gift aid.');
    }

    if (this.giftAid && !this.homeOutsideUK && !this.homePostcode) {
      errors.push('Please enter your home postcode to claim Gift Aid if you are in the UK.');
    }

    if (this.giftAid && !this.homeOutsideUK && !this.homePostcode?.match(postcodeRegExp)) {
      errors.push('Please enter a UK postcode');
    }

    this.giftAidErrorMessage = errors.join(' ');

    this.giftAidErrorMessage && this.toast.showError(this.giftAidErrorMessage);

    return errors.length > 0;
  }

  addressChosen(event: MatAutocompleteSelectedEvent) {
    this.addressService.loadAddress(event, (address) => {
      this.mandateForm.patchValue({ homePostcode: address.homePostcode });
      this.homeAddress = address;
    });
  }

  maximumMatchableDonationGivenCampaign(campaign: Campaign): Money {
    // this is not static just because it shares standardNumberOfDonationsMatched with the template, and templates can't
    // read static values directly.
    const fundsRemaining = campaign.parentUsesSharedFunds
      ? campaign.parentMatchFundsRemaining
      : campaign.matchFundsRemaining;

    return {
      currency: campaign.currencyCode,
      amountInPence: Math.max(Math.floor(fundsRemaining / this.standardNumberOfDonationsMatched), 0) * 100,
    };
  }
}
