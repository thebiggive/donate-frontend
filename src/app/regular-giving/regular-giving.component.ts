import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Campaign, formattedCampaignSummary } from '../campaign.model';
import {
  BiggiveButton,
  BiggiveFormFieldSelect,
  BiggivePageSection,
  BiggiveTextInput,
} from '@biggive/components-angular';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatHint, MatInput } from '@angular/material/input';
import { MatButton, MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Person } from '../person.model';
import { MandateCreateResponse, RegularGivingService, StartMandateParams } from '../regularGiving.service';
import { Mandate } from '../mandate.model';
import { myRegularGivingPath } from '../app.routes';
import { requiredNotBlankValidator } from '../validators/notBlank';
import { getCurrencyMinValidator } from '../validators/currency-min';
import { getCurrencyMaxValidator } from '../validators/currency-max';
import { Toast } from '../toast.service';
import { MatomoTracker } from 'ngx-matomo-client';
import { ConversionTrackingService } from '../conversionTracking.service';
import { Donation } from '../donation.model';
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
import { billingPostcodeRegExp, HomeAddress, postcodeRegExp } from '../address';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { donorGiftAidTermsUrl, donorTermsUrl, minPasswordLength } from '../../environments/common';
import { environment } from '../../environments/environment';
import { MatCheckbox } from '@angular/material/checkbox';
import { MoneyPipe } from '../money.pipe';
import { BackendError, errorDescription, errorDetails, isInsufficientMatchFundsError } from '../backendError';
import { CampaignService } from '../campaign.service';
import { firstValueFrom, Observable, of, Subscription } from 'rxjs';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { GIFT_AID_FACTOR, Money } from '../Money';
import { EMAIL_REGEXP } from '../validators/patterns';
import { IdentityService } from '../identity.service';
import { WidgetInstance } from 'friendly-challenge';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { noLongNumberValidator } from '../validators/noLongNumberValidator';
import { DonorAccountService } from '../donor-account.service';
import { HttpStatusCode } from '@angular/common/http';

// for now min & max are hard-coded, will change to be based on a field on
// the campaign.
const maxAmount = 500;
const minAmount = 1;
const paymentStepIndex = 3;

// As on donation start form, these opt-in radio buttons seem awkward to click using our regression testing setup, so cheating
// and prefilling them with 'no' values in that case.
const booleansDefaultValue = environment.environmentId === 'regression' ? false : null;

// apologies - been failing to get clicking this checkbox to work all day in regression tests,
// so allowing regression tester to skip it.
const over18DefaultValue = environment.environmentId === 'regression';

@Component({
  selector: 'app-regular-giving',
  imports: [
    BiggiveButton,
    BiggiveFormFieldSelect,
    BiggivePageSection,
    BiggiveTextInput,
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
    MatCheckbox,
    MoneyPipe,
    AsyncPipe,
  ],
  providers: [],
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
  private readonly identityService = inject(IdentityService);
  private matomoTracker = inject(MatomoTracker);
  private conversionTrackingService = inject(ConversionTrackingService);
  protected friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;
  private donorAccountService = inject(DonorAccountService);

  protected mandateForm = new FormGroup({
    donationAmount: new FormControl('', [
      requiredNotBlankValidator,
      getCurrencyMinValidator(minAmount),
      getCurrencyMaxValidator(maxAmount),
      Validators.pattern('^\\s*[£$]?[0-9]+?(\\.00)?\\s*$'),
    ]),
    emailAddress: new FormControl('', [
      requiredNotBlankValidator,
      // Regex below originally based on EMAIL_REGEXP in donate-frontend/node_modules/@angular/forms/esm2020/src/validators.mjs
      Validators.pattern(EMAIL_REGEXP),
    ]),
    firstName: new FormControl('', [Validators.maxLength(40), requiredNotBlankValidator, noLongNumberValidator]),
    lastName: new FormControl('', [Validators.maxLength(40), requiredNotBlankValidator, noLongNumberValidator]),
    billingPostcode: new FormControl('', [requiredNotBlankValidator, Validators.pattern(billingPostcodeRegExp)]),
    optInCharityEmail: new FormControl(booleansDefaultValue, requiredNotBlankValidator),
    optInTbgEmail: new FormControl(booleansDefaultValue, requiredNotBlankValidator),
    giftAid: new FormControl(booleansDefaultValue, requiredNotBlankValidator),
    homeOutsideUK: new FormControl<string | null>(null),
    homeAddress: new FormControl<string | null>(null),
    homePostcode: new FormControl<string | null>(null),
    unmatched: new FormControl(false), // If ticked, indicates that the donor is willing to donate without match funding.
    aged18OrOver: new FormControl(over18DefaultValue, [Validators.requiredTrue]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6), // temp password is six random digits
    ]),
    newPassword: new FormControl('', [Validators.minLength(minPasswordLength)]),
  });

  protected campaign!: Campaign;
  @ViewChild('stepper') private stepper!: MatStepper;
  readonly privacyUrl = 'https://biggive.org/privacy';
  protected donor?: Person | null;

  /** May now be undefined as we will be allowing viewing of this page for new users before signup */
  protected donorAccount: DonorAccount | undefined;
  protected countryOptionsObject = countryOptions;
  protected selectedBillingCountryCode!: string;
  private stripeElements: StripeElements | undefined;
  private stripePaymentElement: StripePaymentElement | undefined;

  donorTermsUrl = donorTermsUrl;
  giftAidTermsUrl = donorGiftAidTermsUrl;
  public readonly labelYourPaymentInformation = 'Your Payment Information';

  @ViewChild('cardInfo') protected cardInfo?: ElementRef;
  protected stripeElementLoading = false;

  private stripeCustomerSession: StripeCustomerSession | undefined;
  protected submitting: boolean = false;

  protected amountErrorMessage: string | undefined;
  protected emailErrorMessage: string | undefined;
  protected errorHtml: SafeHtml | undefined;
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
  protected formattedCampaignSummary!: string;
  private sanitizer = inject(DomSanitizer);

  @ViewChild('frccaptcha', { static: false })
  protected friendlyCaptcha!: ElementRef<HTMLElement>;
  private friendlyCaptchaSolution: string | undefined;
  private friendlyCaptchaWidget!: WidgetInstance;
  private platformId = inject(PLATFORM_ID);

  protected processingTempPasswordRequest = false;
  protected readonly showPassword = signal(false);
  protected emailTokenValid = false;

  /** Determines if we should show form parts related to setting up a new account. If the account is created
   * within this form, then we continue showing the filled fields
   */
  protected donorAccountExistsOnLoad = false;

  /**
   * True if the donor logged into an existing account within this page, rather than either creating a new one or
   * already being logged in. In this case we continue to show the email and password fields that they used to log in
   * but don't ask them to set a password etc.
   */
  protected loggedInToExistingAccount = false;

  private loginStatusChangeSubscription: Subscription | undefined;

  ngOnInit() {
    this.donor = this.route.snapshot.data['donor'];
    this.donorAccount = this.route.snapshot.data['donorAccount'];

    this.campaign = this.route.snapshot.data['campaign'];
    this.formattedCampaignSummary = formattedCampaignSummary(this.campaign);

    if (!this.campaign.isRegularGiving) {
      console.error('Campaign ' + this.campaign.id + ' is not a regular giving campaign');
    }

    this.campaignOpenOnLoad = CampaignService.isOpenForDonations(this.campaign);
    if (!this.campaignOpenOnLoad) {
      void this.router.navigateByUrl(`/campaign/${this.campaign.id}`);
    }

    this.pageMeta.setCommon(
      `Regular Giving for ${this.campaign.charity.name}`,
      `Regular Giving for ${this.campaign.charity.name}`,
      this.campaign.banner?.uri,
    );

    if (this.donorAccount) {
      this.prepareFormForDonor();
      this.donorAccountExistsOnLoad = true;
      this.updateNewPasswordValidation();
    }

    this.maximumMatchableDonation = this.maximumMatchableDonationGivenCampaign(this.campaign);

    if (this.maximumMatchableDonation.amountInPence === 0) {
      this.matchFundsZeroOnLoad = true;
      this.mandateForm.patchValue({ unmatched: true });
    }

    // @todo DON-1195 - run this check again if/when an existing donor logs in to stop them making another mandate for same campaign.
    // I think it is already blocked in matchbot.
    this.preExistingActiveMandate$ = this.donorAccount
      ? this.regularGivingService.activeMandate(this.campaign)
      : of([]);

    this.loginStatusChangeSubscription = this.identityService.loginStatusChanged.subscribe({
      next: async () => {
        const donor = await firstValueFrom(this.identityService.getLoggedInPerson());
        if (!donor) {
          // should be impossible as on logout we refresh the page anyway.
          return;
        }
        this.donor = donor;
        this.donorAccount = (await firstValueFrom(this.donorAccountService.getLoggedInDonorAccount())) || undefined;
        this.mandateForm.get('emailAddress')?.disable();
        this.mandateForm.get('password')?.disable();
        this.prepareFormForDonor();
        this.toast.showSuccess('You are now logged in');
      },
    });
  }

  private prepareFormForDonor() {
    if (!this.donorAccount) {
      throw new Error('Donor account not set');
    }

    if (!this.donor) {
      throw new Error('Donor not set');
    }

    this.selectedBillingCountryCode = this.donorAccount.billingCountryCode ?? 'GB';

    this.stripeService.init().catch(console.error);

    const donor = this.donor!;
    const controls = this.mandateForm.controls;

    controls.emailAddress.setValue(donor.email_address || '');
    controls.firstName.setValue(donor.first_name || '');
    controls.lastName.setValue(donor.last_name || '');
    controls.billingPostcode.setValue(this.donorAccount.billingPostCode);
    controls.password.removeValidators(Validators.required); // they only need to supply a new password for setting up an account.

    this.donationService
      .createCustomerSessionForRegularGiving({ campaign: this.campaign })
      .then((session) => {
        this.stripeCustomerSession = session;
        if (!this.stripeElements && this.stepper.selected?.label === this.labelYourPaymentInformation) {
          this.prepareStripeElements();
        }
      })
      .catch(console.error);
  }

  ngOnDestroy() {
    if (this.stripePaymentElement) {
      this.stripePaymentElement.off('change');
      this.stripePaymentElement.destroy();
      this.stripePaymentElement = undefined;
      this.stripeElements = undefined;
    }

    this.loginStatusChangeSubscription?.unsubscribe();
  }

  protected get showUnmatchedDonationOption() {
    return this.matchFundsZeroOnLoad || this.newDonationAmountOverMaxMatchable || this.unmatched;
  }

  async ngAfterViewInit() {
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

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (environment.environmentId === 'regression') {
      this.friendlyCaptchaSolution = 'dummy-captcha-code';
      return;
    }

    this.friendlyCaptchaWidget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.friendlyCaptchaSolution = solution;
      },
      errorCallback: (error: unknown) => {
        // not sure if this ever really happens, but will show an error message in case it does.
        console.error(error);
        this.toast.showError(
          'Sorry, something went wrong with the CAPTCHA - please try again or contact Big Give support.',
        );
      },
    });
    await this.friendlyCaptchaWidget.start();
  }

  protected get newDonationAmountOverMaxMatchable() {
    if (this.maximumMatchableDonation.amountInPence >= maxAmount * 100) {
      // then the maxAmount is going to be the one the matters, we don't allow a single donation big enough to use
      // up all these match funds at once. So to simplify what we tell the donor we can return false here, and let
      // them only get an error about their donation being more than maxAmount, if it is more.

      return false;
    }

    return this.donationAmount.amountInPence > this.maximumMatchableDonation.amountInPence;
  }

  async interceptSubmitAndProceedInstead(event: Event) {
    event.preventDefault();
    this.continue();
  }

  stepChanged(event: StepperSelectionEvent) {
    this.matomoTracker.trackEvent('donate', 'regular_giving_step_changed', `Entered step ${event.selectedStep.label}`);

    if (event.selectedStep.label === this.labelYourPaymentInformation) {
      this.prepareStripeElements();
    }
  }

  async submit() {
    if (!this.donorAccount) {
      // this should never happen, we won't allow the donor to see the submit button while they aren't logged in to an
      // account.
      this.toast.showError('No donor account found, cannot create regular giving mandate');
      return;
    }
    const invalid = this.mandateForm.invalid;
    if (invalid) {
      let errorMessage = 'Form error: ';
      if (this.mandateForm.get('donationAmount')?.hasError('required')) {
        errorMessage += 'Monthly donation amount is required';
      } else {
        const validationErrorSummary = this.getFormValidationErrorSummary();
        console.error('Unexpected regular giving form error', validationErrorSummary);
        this.matomoTracker.trackEvent('donate_error', 'regular_giving_unexpected_form_error', validationErrorSummary);
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
        { billingPostalAddress: this.billingPostCode ?? '', countryCode: billingCountry },
        this.stripeElements,
      );

      confirmationToken = confirmationTokenResult.confirmationToken;
    }
    if (!this.donorAccount.regularGivingPaymentMethod && !confirmationToken) {
      this.submitting = false;
      throw new Error('Stripe Confirmation token is missing');
    }

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
            } else {
              this.matomoTracker.trackEvent('donate', 'exit_requires_action_non_error', 'Assuming 3DS or PBB success');
            }
          }

          const stripeMethod = confirmationToken?.payment_method_preview?.type || 'card';
          this.matomoTracker.trackEvent(
            'donate',
            `stripe_${stripeMethod}_payment_success`,
            `Stripe Intent processing or done for mandate ${response.mandate.id} to campaign ${this.campaign.id}, stripe method ${stripeMethod}`,
          );

          // We don't directly make a Donation so need a dummy one in order to share the same ecommerce
          // tracking as the one-time donation journey.
          const dummyDonation = {
            donationAmount: response.mandate.donationAmount.amountInPence / 100,
            donationId: response.mandate.id,
            projectId: response.mandate.campaignId,
            tipAmount: 0,
          } as unknown as Donation;
          this.conversionTrackingService.convert(dummyDonation, this.campaign, stripeMethod);

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

  private getFormValidationErrorSummary(): string {
    return Object.entries(this.mandateForm.controls)
      .filter(([, control]) => control.invalid)
      .map(([controlName, control]) => `${controlName}: ${Object.keys(control.errors ?? {}).join(', ')}`)
      .join('; ');
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

    this.stripePaymentElement = StripeService.createStripeElement(
      this.stripeElements,
      this.stripeService.defaultPaymentMethodOrder,
    );

    if (this.cardInfo && this.stripePaymentElement) {
      this.stripePaymentElement.mount(this.cardInfo.nativeElement);
      this.stripeElementLoading = true;

      // https://docs.stripe.com/js/element/events/on_change
      // @ts-expect-error Not sure why only 'loaderstart' sig is recognised now.
      this.stripePaymentElement.on('change', this.cardHandler);

      // https://docs.stripe.com/js/element/events/on_ready
      this.stripePaymentElement.on('ready', () => (this.stripeElementLoading = false));
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
      if (this.stepper.selectedIndex > paymentStepIndex + this.newDonorAdditionalStepCount) {
        this.stepper.selectedIndex = paymentStepIndex + this.newDonorAdditionalStepCount;
      }

      return;
    }
  }

  protected async continue(): Promise<void> {
    const nextStepIndex = this.stepper.selectedIndex + 1;
    if (nextStepIndex > this.stepper.steps.length - 1) {
      throw new Error('Cannot continue past last step');
    }

    await this.selectStep(nextStepIndex);
  }

  private async selectStep(stepIndex: number) {
    if (stepIndex > 0 && this.validateAmountStep()) {
      return;
    }
    // 1 is new password which doesn't yet have validation code here.
    // 2 is about you which doesn't yet have validation code here.

    if (stepIndex > 2 + this.newDonorAdditionalStepCount && this.validateGiftAidStep()) {
      return;
    }

    if (stepIndex > 3 + this.newDonorAdditionalStepCount && this.validatePaymentInformationStep()) {
      return;
    }

    if (stepIndex > 4 + this.newDonorAdditionalStepCount && this.validateUpdatesStep()) {
      return;
    }

    if (this.giftAid && this.homePostcode?.trim() && !this.billingPostCode?.trim()) {
      this.mandateForm.patchValue({
        billingPostcode: this.homePostcode,
      });
    }

    if (stepIndex === 1) {
      // this is the Send email button so let's send an email unless there's already a logged in donor.

      if (!this.friendlyCaptchaSolution && !this.donor) {
        this.toast.showError('Please wait for or complete the CAPTCHA before continuing.');
        return;
      }

      if (!this.donor) {
        this.processingTempPasswordRequest = true;
        try {
          // @todo-DON-1195: CHeck the friendlyCaptchaSolution is provided, don't just assume its truthy - show the donor an error message if its missing e.g. because they clicked send email too quickly.
          // @todo-DON-1195: Request an email with different copy from the idenity service that's specific to the fact that they're in the process of setting up a regular giving mandate, and refers to "temporary password"
          // @todo-DON-1195: instead of a verification code (once we've adjust the login function to accept a verification code typed instead of a password).
          // @todo-DON-1195: work out how/where we're going to be collecting the donor's first and last name, which we should only need to ask for if its a new account. May be a challenge to the idea of using the same input box to accept either
          // @todo-DON-1195: a password for an existing account or a verification code aka temporary password for a new account.
          await this.identityService.requestEmailAuthToken(this.mandateForm.controls.emailAddress.value!, {
            captcha_code: this.friendlyCaptchaSolution!,
            regularGiving: true,
          });
          // this.verificationLinkSentToEmail = emailAddress;
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        } catch (error: any) {
          this.extractErrorMessage(error);
          return;
        } finally {
          this.friendlyCaptchaWidget?.reset();
          await this.friendlyCaptchaWidget?.start();
          this.processingTempPasswordRequest = false;
        }
      }
    }

    this.stepper.selected = this.stepper.steps.get(stepIndex);
  }

  private get newDonorAdditionalStepCount() {
    // if the donor account doesn't exist or isn't logged in on form load then we have one more step "your password"
    // for them to authenticate. That affects the numbering of later steps.
    return this.donorAccountExistsOnLoad ? 0 : 1;
  }

  protected get optInCharityEmail(): boolean | undefined {
    return this.mandateForm.value.optInCharityEmail ?? undefined;
  }

  protected get optInTbgEmail(): boolean | undefined {
    return this.mandateForm.value.optInTbgEmail ?? undefined;
  }

  protected get homeAddressFormValue(): string {
    return this.mandateForm.value.homeAddress ?? '';
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

    const emailErrors = this.mandateForm.controls.emailAddress.errors;
    if (emailErrors) {
      for (const [key] of Object.entries(emailErrors)) {
        switch (key) {
          case 'required':
            this.emailErrorMessage =
              'Please enter your email address. You will be able to set up a new account or log in to any existing Big Give donor account';
            break;
          case 'pattern':
            this.emailErrorMessage = `Sorry, your email address is not recognised - please enter a valid email address.`;
            break;
          default:
            this.emailErrorMessage = 'Unexpected donation email address error';
            console.error({ emailErrors });
            break;
        }
      }
      this.toast.showError(this.emailErrorMessage!);
      errorFound = true;
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
    if (combinedErrors) {
      this.toast.showError(combinedErrors);
    }

    return errorFound;
  }

  /**
   * Checks if the payment information step is completed correctly, and shows the user an error message if not.
   */
  private validatePaymentInformationStep(): boolean {
    this.paymentInfoErrorMessage = undefined;

    if (!this.donorAccount) {
      // likely this branch can never happen as we will check donor has an account before they see the payment information
      // step
      this.paymentInfoErrorMessage = 'Please login or create your donor account';
    } else if (!this.stripePaymentMethodReady && !this.donorAccount.regularGivingPaymentMethod) {
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

    if (this.paymentInfoErrorMessage) {
      this.toast.showError(this.paymentInfoErrorMessage);
    }

    return !!this.paymentInfoErrorMessage;
  }

  private validateGiftAidStep(): boolean {
    const errors: string[] = [];
    if (typeof this.giftAid !== 'boolean') {
      errors.push('Please choose whether you wish to claim Gift Aid.');
    }

    if (this.giftAid && !this.homeAddressFormValue) {
      errors.push('Please enter or select your home address if you wish to claim Gift Aid.');
    }

    if (this.giftAid && !this.homeOutsideUK && !this.homePostcode) {
      errors.push('Please enter your home postcode to claim Gift Aid if you are in the UK.');
    }

    if (this.giftAid && !this.homeOutsideUK && !this.homePostcode?.match(postcodeRegExp)) {
      errors.push('Please enter a UK postcode.');
    }

    if (!this.donorAccount) {
      // @todo-don-1195 - replace with a more detailed message based on exactly how far through logging in or creating the
      // account they've got.
      // also confirm if this error needs to come before they see the Gift Aid step or if it is actually OK for them to fill
      // in the Gift Aid section of the form before logging in.
      // and of course add the facility for them to actuall log in or signup into the stepper before they reach this point.
      errors.push('Please login or create a donor account.');
    }

    this.giftAidErrorMessage = errors.join(' ');

    if (this.giftAidErrorMessage) {
      this.toast.showError(this.giftAidErrorMessage);
    }

    return errors.length > 0;
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

  private extractErrorMessage = (error: BackendError) => {
    const errorInfo = errorDetails(error);
    if (errorInfo.htmlDescription) {
      // this HTML can only have come back from our identity server, which we consider trustworthy.
      this.errorHtml = this.sanitizer.bypassSecurityTrustHtml(errorInfo.htmlDescription);
    } else {
      this.emailErrorMessage = errorDescription(error);
    }
  };

  protected toggleShowPassword() {
    this.showPassword.update((current) => !current);
  }

  protected async continueFromAuthentication() {
    const captchaCode = this.friendlyCaptchaSolution;
    if (!captchaCode) {
      this.toast.showError('Captcha code missing - cannot continue');
      return;
    }

    const emailAddress = this.mandateForm.controls.emailAddress.value;
    if (!emailAddress) {
      this.toast.showError('Email address missing - cannot continue');
      return;
    }

    const password = this.mandateForm.controls.password.value;
    if (!password) {
      this.toast.showError('password missing - cannot continue');
      return;
    }

    const response$ = this.identityService.loginOrGetAuthToken({
      captcha_code: captchaCode,
      email_address: emailAddress,
      raw_password: password,
    });

    let response;
    try {
      response = await firstValueFrom(response$);
    } catch (e: unknown) {
      const backendError = e as BackendError;
      if (backendError?.status === HttpStatusCode.Unauthorized) {
        // we might also signpost the "forgot password" feature here, but I think the below is about the limit of
        // length we want in a toast.
        this.toast.showError(
          'Your email or password is incorrect. Please try typing your password again, or go back and check the email address.',
        );
        return;
      }

      // will happen e.g. if Identity server is down:
      this.toast.showError(backendError.message);
      return;
    }

    if (response.type === 'jwt') {
      this.loggedInToExistingAccount = true;
      this.updateNewPasswordValidation();
    } else if (response.type === 'emailVerificationToken') {
      this.emailTokenValid = true;
    }
    this.stepper.next();
  }

  private updateNewPasswordValidation(): void {
    const newPasswordControl = this.mandateForm.controls.newPassword;

    if (!this.donorAccountExistsOnLoad && !this.loggedInToExistingAccount) {
      newPasswordControl.setValidators(Validators.minLength(minPasswordLength));
    } else {
      newPasswordControl.clearValidators();
    }

    newPasswordControl.updateValueAndValidity({ emitEvent: false });
  }

  protected async continueFromAboutYou() {
    if (this.donor) {
      // already logged in, no need to do anything.
      this.stepper.next();
      return;
    }

    // @todo-DON-1195 - replace exclamation marks below with proper guards
    this.identityService
      .create({
        captcha_code: this.friendlyCaptchaSolution,
        email_address: this.mandateForm.controls.emailAddress.value!,
        first_name: this.mandateForm.controls.firstName.value!,
        last_name: this.mandateForm.controls.lastName.value!,
        is_organisation: false,
        raw_password: this.mandateForm.controls.newPassword.value!,
        secretNumber: this.mandateForm.controls.password.value!,
      })
      .subscribe({
        next: async (person: Person) => {
          this.identityService.saveJWT(person.id!, person.completion_jwt!);
          const donor = await firstValueFrom(this.identityService.getLoggedInPerson());
          if (!donor) {
            this.toast.showError("Sorry, couldn't load details of donor account");
            return;
          }
          this.donor = donor;
          this.donorAccount = (await firstValueFrom(this.donorAccountService.getLoggedInDonorAccount())) || undefined;
          if (this.donorAccount) {
            this.prepareFormForDonor();
          }
          console.log('set donor and donor account', this.donor, this.donorAccount);
          this.stepper.next();
        },
        error: async (error) => {
          this.extractErrorMessage(error);
          this.friendlyCaptchaWidget?.reset();
          await this.friendlyCaptchaWidget?.start();
        },
      });
  }
}
