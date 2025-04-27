import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {isPlatformBrowser} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatDialog} from '@angular/material/dialog';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from '@angular/router';
import {MatomoTracker} from 'ngx-matomo-client';
import {retry} from 'rxjs/operators';
import {
  ConfirmationToken,
  ConfirmationTokenResult,
  PaymentIntent,
  PaymentMethod,
  StripeElementChangeEvent,
  StripeElements,
  StripeError,
  StripePaymentElement,
} from '@stripe/stripe-js';
import {firstValueFrom} from 'rxjs';

import {Campaign} from '../../campaign.model';
import {CardIconsService} from '../../card-icons.service';
import {campaignHiddenMessage} from '../../../environments/common';
import {countryOptions} from '../../countries';
import {Donation, maximumDonationAmount, OVERSEAS} from '../../donation.model';
import {DonationCreatedResponse} from '../../donation-created-response.model';
import {DonationService} from '../../donation.service';
import {DonationStartMatchConfirmDialogComponent} from '../donation-start-match-confirm-dialog.component';
import {DonationStartMatchingExpiredDialogComponent} from '../donation-start-matching-expired-dialog.component';
import {DonationStartOfferReuseDialogComponent} from '../donation-start-offer-reuse-dialog.component';
import {environment} from '../../../environments/environment';
import {ExactCurrencyPipe} from '../../exact-currency.pipe';
import {GiftAidAddressSuggestion} from '../../gift-aid-address-suggestion.model';
import {IdentityService} from '../../identity.service';
import {ConversionTrackingService} from '../../conversionTracking.service';
import {PageMetaService} from '../../page-meta.service';
import {Person} from '../../person.model';
import {AddressService, billingPostcodeRegExp, postcodeFormatHelpRegExp, postcodeRegExp} from '../../address.service';
import {getDelay} from '../../observable-retry';
import {getStripeFriendlyError, StripeService} from '../../stripe.service';
import {getCurrencyMaxValidator} from '../../validators/currency-max';
import {getCurrencyMinValidator} from '../../validators/currency-min';
import {EMAIL_REGEXP} from '../../validators/patterns';
import {updateDonationFromForm} from "../updateDonationFromForm";
import {sanitiseCurrency} from "../sanitiseCurrency";
import {PaymentReadinessTracker} from "./PaymentReadinessTracker";
import {requiredNotBlankValidator} from "../../validators/notBlank";
import {WidgetInstance} from "friendly-challenge";
import {Toast} from "../../toast.service";
import {GIFT_AID_FACTOR} from '../../Money';
import {noLongNumberValidator} from '../../validators/noLongNumberValidator';

declare var _paq: {
  push: (args: Array<string|object>) => void,
};

@Component({
  selector: 'app-donation-start-form',
  templateUrl: './donation-start-form.component.html',
  styleUrl: './donation-start-form.component.scss',
  standalone: false,
  providers: [
    ExactCurrencyPipe,
  ]
})
export class DonationStartFormComponent implements AfterContentChecked, AfterContentInit, OnDestroy, OnInit, AfterViewInit {
  /**
   * If donor gives a GA declaration relating to a core donation only but not a tip to BG then the wording they saw
   * will not have covered GA on a tip as well. So if this is true and they go back and add a tip we will need to
   * re-prompt them to declare for gift aid.
   */
  private giftAidCheckedForZeroTip: boolean = false;

  @ViewChild('cardInfo') cardInfo!: ElementRef;
  @ViewChild('stepper') private stepper!: MatStepper;

  alternateCopy = false; // Varies tip copy for A/B test.

  stripePaymentElement: StripePaymentElement | undefined;
  cardHandler = this.onStripeCardChange.bind(this);
  showChampionOptIn = false;

  @Input({ required: true }) campaign!: Campaign;

  /**
   * Called when the donation object is set or deleted. **NOT** called when properties of the object are changed.
   */
  @Input() donationChangeCallBack: (donation: Donation | undefined) => void = () => {};

  donation?: Donation;

  /**
   * This property shouldn't really exist - if the campaign isn't open there's no need to load this component at all.
   * It's just here as a hack to work around issues with exact currency pipe in tests that appeared when removing it.
   *
   */
  @Input() campaignOpenOnLoad = false;

  friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;

  creditPenceToUse = 0; // Set non-zero if logged in and Customer has a credit balance to spend. Caps donation amount too in that case.
  currencySymbol!: string;

  donationForm!: FormGroup;
  amountsGroup!: FormGroup;
  giftAidGroup!: FormGroup;
  paymentGroup!: FormGroup;
  marketingGroup!: FormGroup;

  maximumDonationAmount!: number;
  maximumTipPercentage = 30 as const;

  showDebugInfo = environment.showDebugInfo;

  /**
   * This is a suggested minimum, the lowest people can select using the slider. We still let them select any tip amount
   * of custom tip, including zero.
   */
  minimumTipPercentage = 1 as const;
  readonly suggestedTipPercentages = [
    {value: '7.5', label: '7.5%'},
    {value: '10', label: '10%'},
    {value: '12.5', label: '12.5%'},
    {value: '15', label: '15%'},
    {value: 'Other', label: 'Other'}
  ] as const;

  noPsps = false;
  psp!: 'stripe';
  retrying = false;
  addressSuggestions: GiftAidAddressSuggestion[] = [];
  donationCreateError = false;
  donationUpdateError = false;
  /** setTimeout reference (timer ID) if applicable. */
  expiryWarning?: ReturnType<typeof setTimeout>; // https://stackoverflow.com/a/56239226
  loadingAddressSuggestions = false;
  privacyUrl = 'https://biggive.org/privacy';

  /** Briefly true each time the final step's entered. Hides final Stripe-activating button. */
  runningFinalPreSubmitUpdate = false;

  // Kind of a subset of `stripePaymentMethodReady`, which tracks just the Payment Element Stripe.js element based
  // on the `complete` property of the callback event. Doesn't cover saved cards, or donation credit.
  // Maintains its value and is NOT reset when settlement method changes to one of those, since it might
  // change back.
  stripeManualCardInputValid = false;

  stripePaymentMethodReady = false;
  stripeError?: string;
  submitting = false;
  termsUrl = 'https://biggive.org/terms-and-conditions';
  // Track 'Next' clicks so we know when to show missing radio button error messages.
  triedToLeaveGiftAid = false;
  triedToLeaveMarketing = false;
  showAllPaymentMethods: boolean = false;

  protected campaignId!: string;

  /**
   * Tracks internally whether (Person +) Donation setup is in flight. This is important to prevent duplicates, because multiple
   * time-variable triggers including user-initiated stepper step changes and async captcha returns can cause us
   * to decide we are ready to set these things up.
   */
  private creatingDonation = false;

  private defaultCountryCode: string;
  public selectedCountryCode: string;
  private previousDonation?: Donation;
  private stepHeaderEventsSet = false;
  private tipPercentageChanged = false;

  tipPercentage = 15;
  tipValue: number | undefined;

  private idCaptchaCode?: string;
  private stripeResponseErrorCode?: string; // stores error codes returned by Stripe after callout
  private stepChangeBlockedByCaptcha = false;
  @Input({ required: true }) donor: Person | undefined;

  public tipControlStyle: 'dropdown';

  panelOpenState = false;
  showCustomTipInput = false;

  confirmStepLabel = 'Confirm' as const;
  yourDonationStepLabel = 'Your donation' as const;

  displayCustomTipInput = () => {
    this.amountsGroup.get('tipAmount')?.setValue('');

    // We don't want to show a validation error right now just because this is empty. We will show it if the donor goes into this field and then leaves it invalid.
    this.amountsGroup.get('tipAmount')?.markAsUntouched();
    this.showCustomTipInput = true;
  }

  displayPercentageTipInput = () => {
    const tipValue = Math.max(
      this.minimumTipPercentage * this.donationAmount / 100,
      Math.min(this.maximumTipPercentage * this.donationAmount / 100, this.tipValue || 0)
    );

    const tipValueRounded = tipValue.toFixed(2);
    this.tipValue = Number(tipValueRounded);

    this.amountsGroup.get('tipAmount')?.setValue(tipValueRounded);
    this.showCustomTipInput = false;
  }

  private stripeElements: StripeElements | undefined;
  private selectedPaymentMethodType: string | undefined;
  private paymentReadinessTracker!: PaymentReadinessTracker;
  public paymentStepErrors: string = "";
  private donationRetryTimeout: number|undefined = undefined;

  @ViewChild('frccaptcha', { static: false })
  friendlyCaptcha: ElementRef<HTMLElement>|undefined;
  protected shouldShowCaptcha: boolean = true;
  protected isSavedPaymentMethodSelected: boolean = false;
  protected zeroTipTextABTestVariant: 'A'|'B' = 'A';
  private manuallySelectedABTestVariant: string | null = null;
  protected countryOptionsObject = countryOptions;
  private friendlyCaptchaWidget: WidgetInstance | undefined;

  constructor(
    public cardIconsService: CardIconsService,
    private cd: ChangeDetectorRef,
    private conversionTrackingService: ConversionTrackingService,
    public dialog: MatDialog,
    private donationService: DonationService,
    @Inject(ElementRef) private elRef: ElementRef,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
    private matomoTracker: MatomoTracker,
    private pageMeta: PageMetaService,
    private addressService: AddressService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private stripeService: StripeService,
    private toast: Toast
  ) {
    this.defaultCountryCode = this.donationService.getDefaultCounty();
    this.selectedCountryCode = this.defaultCountryCode;

    const queryParams = route.snapshot.queryParams;

    this.tipControlStyle = 'dropdown';


    if (! environment.production) {
      this.manuallySelectedABTestVariant = queryParams?.selectABTestVariant;
    }


    if (this.manuallySelectedABTestVariant == 'B') {
      this.zeroTipTextABTestVariant = 'B';
    }
  }

  ngOnDestroy() {
    if (this.donation) {
      this.clearDonation(this.donation, {clearAllRecord: false, jumpToStart: false});
    }

    this.destroyStripeElements();

    clearTimeout(this.donationRetryTimeout);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      /**
       * For some reason awaiting this promise makes tests fail with
       * "Cannot read properties of undefined (reading 'setValue')". Not sure why, but we can send any error to the
       * console at least.
       */
      this.stripeService.init().catch(console.error);

      // ngx-matomo sets up window._paq internally, and doesn't have
      // A/B test methods, so we work with the global ourselves.
      if (environment.matomoAbTest && globalThis.hasOwnProperty('_paq')) {
        _paq.push(['AbTesting::create', {
          name: environment.matomoAbTest.name,
          percentage: 100,
          includedTargets: [{"attribute":"url","inverted":"0","type":"any","value":""}],
          excludedTargets: [],
          startDateTime: environment.matomoAbTest.startDate,
          endDateTime: environment.matomoAbTest.endDate,
          variations: [
            {
                name: 'original',
                activate: (_event: unknown) => {
                  // No change from the original form.
                  console.log('Original test variant active!');
                  this.zeroTipTextABTestVariant = 'A';
                }
            },
            {
                name: environment.matomoAbTest.variantName,
                activate: (_event: unknown) => {
                  if (this.manuallySelectedABTestVariant) {
                    return;
                  }
                  this.zeroTipTextABTestVariant = 'B';
                  console.log('Copy B test variant active!');
                }
            },
          ],
          trigger: () => {
              return true;
          },
        }]);
      }
    }

    this.setCampaignBasedVars();

    // As on regular-giving form, these opt-in radio buttons seem awkward to click using our regression testing setup, so cheating
    // and prefilling them with 'no' values in that case.
    const marketingBooleansDefaultValue = environment.environmentId === 'regression' ? false : null;

    const formGroups: {
      amounts: FormGroup,   // Matching reservation happens at the end of this group.
      giftAid: FormGroup,
      marketing: FormGroup,
      payment: FormGroup,  // Always present now we're Stripe-only.
    } = {
      amounts: this.formBuilder.group({
        donationAmount: [null, [
          requiredNotBlankValidator,
          getCurrencyMinValidator(1), // min donation is £1
          getCurrencyMaxValidator(),
          Validators.pattern('^[£$]?[0-9]+?(\\.00)?$'),
        ]],
        tipPercentage: [this.tipPercentage], // See setConditionalValidators().
        tipAmount: [null], // See setConditionalValidators()
      }),
      giftAid: this.formBuilder.group({
        giftAid: [null],        // See addUKValidators().
        homeAddress: [null],  // See setConditionalValidators().
        homeBuildingNumber: [null],
        homeOutsideUK: [null],
        homePostcode: [null], // See setConditionalValidators().
      }),
      marketing: this.formBuilder.group({
        optInCharityEmail: [marketingBooleansDefaultValue, requiredNotBlankValidator],
        optInTbgEmail: [marketingBooleansDefaultValue, requiredNotBlankValidator],
        optInChampionEmail: [marketingBooleansDefaultValue],
      }),
      payment: this.formBuilder.group({
        firstName: [null, [
          Validators.maxLength(40),
          requiredNotBlankValidator,
          noLongNumberValidator,
        ]],
        lastName: [null, [
          Validators.maxLength(80),
          requiredNotBlankValidator,
          noLongNumberValidator,
        ]],
        emailAddress: [null, [
          requiredNotBlankValidator,
          // Regex below originally based on EMAIL_REGEXP in donate-frontend/node_modules/@angular/forms/esm2020/src/validators.mjs
          Validators.pattern(EMAIL_REGEXP),
        ]],
        billingCountry: [this.defaultCountryCode], // See setConditionalValidators().
        billingPostcode: [null],  // See setConditionalValidators().
      }),
      // T&Cs agreement is implicit through submitting the form.
    };

    this.donationForm = this.formBuilder.group(formGroups);

    // Current strict type checks mean we need to do this for the compiler to be happy that
    // the groups are not null.
    const amountsGroup: any = this.donationForm.get('amounts');
    if (amountsGroup != null) {
      this.amountsGroup = amountsGroup;
    }

    const giftAidGroup: any = this.donationForm.get('giftAid');
    if (giftAidGroup != null) {
      this.giftAidGroup = giftAidGroup;
    }

    const paymentGroup: any = this.donationForm.get('payment');
    if (paymentGroup != null) {
      this.paymentGroup = paymentGroup;
    }

    const marketingGroup: any = this.donationForm.get('marketing');
    if (marketingGroup != null) {
      this.marketingGroup = marketingGroup;
    }

    this.amountsGroup.get('tipAmount')?.valueChanges.subscribe((tipAmount: string) => {
      this.tipValue = sanitiseCurrency(tipAmount?.trim());

      if (this.tipValue && this.tipValue > 0 && this.giftAidCheckedForZeroTip) {
        // The gifit aid wording for a zero tip doesn't cover GA for the tip, so we reset the form control now and
        // let the donor redeclare.
        this.giftAidGroup.get('giftAid')?.reset();
        this.giftAidCheckedForZeroTip = false;
        this.triedToLeaveGiftAid = false;
      } else {
        const gaValue: boolean|null = this.giftAidGroup.get('giftAid')?.value;
        this.giftAidCheckedForZeroTip = this.tipValue === 0 && !!gaValue;
      }
    });

    this.maximumDonationAmount = maximumDonationAmount(this.campaign.currencyCode, this.creditPenceToUse);

    this.paymentReadinessTracker = new PaymentReadinessTracker(this.paymentGroup)

    if (isPlatformBrowser(this.platformId)) {
      this.handleCampaignViewUpdates();
    }
  }

  async ngAfterViewInit() {
    if (! isPlatformBrowser(this.platformId)) {
      return;
    }

    const friendlyCaptcha = this.friendlyCaptcha;

    if (! friendlyCaptcha) {
      // should always be loaded from the template, but not present in tests.
      return;
    }

    if (environment.environmentId === 'regression') {
      this.idCaptchaCode = "dummy-captcha-code";
      return;
    }

    this.friendlyCaptchaWidget = new WidgetInstance(friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.idCaptchaCode = solution;
        if (this.stepChangeBlockedByCaptcha) {
          this.stepper.next();
          this.stepChangeBlockedByCaptcha = false;
        }
      },
      errorCallback: (error: unknown) => {
        this.toast.showError("Sorry, there was an error with the anti-spam captcha check.");
        console.error(error);
      },
    });

    await this.friendlyCaptchaWidget.start();
  }

  public setSelectedCountry = ((countryCode: string) => {
    this.selectedCountryCode = countryCode;
    this.paymentGroup.patchValue({
      billingCountry: countryCode,
    });
  })

  resumeDonationsIfPossible() {
    this.donationService.getProbablyResumableDonation(this.campaignId, this.getPaymentMethodType())
      .subscribe((existingDonation: (Donation|undefined)) => {
        this.previousDonation = existingDonation;

        // The local check might not have the latest donation status in edge cases, so we need to check the copy
        // the Donations API returned still has a resumable status and wasn't completed or cancelled since being
        // saved locally.
        if (!existingDonation || !this.donationService.isResumable(existingDonation, this.getPaymentMethodType())) {
          // No resumable donations
          return;
        }

        // We have a resumable donation and aren't processing an error
        if (this.donor && this.donor.stripe_customer_id !== existingDonation.pspCustomerId) {
          // We can't resume a donation that has a different customer ID on it. Probably user logged in
          // after creating the donation.
          this.donationService.cancel(existingDonation).subscribe(() => {
            this.matomoTracker.trackEvent(
              'donate',
              'cancel_auto',
              `Donation cancelled due to donor authentication change`,
            );
            this.refreshDonationAndStripe();
          });
          return;
        }

        this.offerExistingDonation(existingDonation);
    });
  }

  /**
   * Called when the pending donation has reached an unusable state - we need to replace it (and the stripe elements)
   * with a new one to let the donor try again.
   */
  private refreshDonationAndStripe(): void {
    this.destroyStripeElements();
    if (this.donation) {
      // We already know the requested amount, so no need to jump back.
      this.clearDonation(this.donation, {clearAllRecord: true, jumpToStart: false});
    }
    this.createDonationAndMaybePerson();
    this.prepareStripeElements();
  }

  ngAfterContentInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.addressService.suggestAddresses({
        homeAddressFormControl: this.giftAidGroup.get('homeAddress')!,
        loadingAddressSuggestionCallback: () => {this.loadingAddressSuggestions = true;},
        foundAddressSuggestionCallback: (suggestions: GiftAidAddressSuggestion[]) => {
          this.loadingAddressSuggestions = false;
          this.addressSuggestions = suggestions;
        }
      });
  }

  ngAfterContentChecked() {
    // Because the Stepper header elements are built by Angular from the `mat-step` elements,
    // there is no nice 'Angular way' to listen for click events on them, which we need to do
    // to clearly surface errors by scrolling to them when donors click Step headings to navigate
    // rather than Next buttons. So to handle this appropriately we need to listen for clicks
    // via the native elements.

    // We set this up here as a one-shot thing but in a lifecycle hook because `campaign` is not
    // guaranteed set on initial load, and the view is also not guaranteed to update with a
    // rendered #stepper by the time we are the end of `handleCampaign()` or similar.

    const stepper = this.elRef.nativeElement.querySelector('#stepper');

    // Can't do it, already did it, or server-side and so can't add DOM-based event listeners.
    if (!this.stepper || this.stepHeaderEventsSet || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const stepperHeaders = stepper.getElementsByClassName('mat-step-header');
    for (const stepperHeader of stepperHeaders) {
      stepperHeader.addEventListener('click', (clickEvent: any) => {
        if (this.stepper.selectedIndex > 0) {
          this.validateAmountsCreateDonorDonationIfPossible(); // Handles amount error if needed, like Continue button does.
          return;
        }

        // usages of clickEvent.target may be wrong - wouldn't type check if we typed clickEvent as PointerEvent
        // instead of Any. But not changing right now as could create regression and doesn't relate to any known bug.
        if (clickEvent.target.innerText.includes('Your details') && this.stepper.selected?.label === 'Gift Aid') {
          this.triedToLeaveGiftAid = true;
        }

        if (clickEvent.target.innerText.includes('Confirm') && this.stepper.selected?.label === 'Your details') {
          this.triedToLeaveMarketing = true;
        }

        if (this.psp === 'stripe' && clickEvent.target.innerText.includes('Receive updates') && !this.stripePaymentMethodReady) {
          this.jumpToStep('Payment details');
        }

        this.goToFirstVisibleError();
      });
    }
    this.stepHeaderEventsSet = true;
  }

  reset = () => {
    this.donor = undefined;
    this.creditPenceToUse = 0;
    this.stripePaymentMethodReady = false;
    this.paymentReadinessTracker = new PaymentReadinessTracker(this.paymentGroup);
    this.donationForm.reset();
    this.identityService.logout();
    this.destroyStripeElements();

    // We should probably reinstate `this.idCaptcha.reset();` here iff we replace the full
    // location.reload(). For as long as we are unloading the whole doc, there should be
    // no need to reset the ViewChild.

    location.reload();
  }

  addressChosen(event: MatAutocompleteSelectedEvent) {
    this.addressService.loadAddress(event, (address) => this.giftAidGroup.patchValue(address));
  }

  async stepChanged(event: StepperSelectionEvent) {
    if (event.selectedIndex > 0 && !this.donor && this.idCaptchaCode == undefined) {
      if (event.selectedIndex >= this.paymentStepIndex) {
        // Try to help explain why they're blocked in cases of persistent later step heading clicks etc.
        this.toast.showError("Sorry, you must complete the puzzle to proceed; this is a security measure to protects donors' cards");
        // Immediate step jumps seem to be disallowed
        setTimeout(() => {
          this.jumpToStep(this.yourDonationStepLabel);
          this.promptForCaptcha();
        }, 200);
      } else {
        this.promptForCaptcha(); // In case we jumped e.g. via step header.
      }

      return;
    }

    // We need to allow enough time for the Stepper's animation to get the window to
    // its final position for this step, before this scroll position update can be reliably
    // helpful.
    setTimeout(() => {
      const activeStepLabel = document.querySelector('.mat-step-label-active');
      if (activeStepLabel) {
        activeStepLabel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);

    // If the original donation amount was updated, cancel that donation and
    // then (sequentially so any match funds are freed up first) create a new
    // one for the updated amount.
    if (this.donation !== undefined && this.donationAmount > 0 && this.donationAmount !== this.donation.donationAmount) {
      this.donationService.cancel(this.donation)
        .subscribe(() => {
          this.matomoTracker.trackEvent(
            'donate',
            'cancel_auto',
            `Donation cancelled because amount was updated ${this.donation?.donationId} to campaign ${this.campaignId}`,
          );

          if (this.donation) {
            // We know the new amount already, so no need to jump back.
            this.clearDonation(this.donation, {clearAllRecord: true, jumpToStart: false});
          }
          this.createDonationAndMaybePerson();
        });

      return;
    }

    if (this.donation && event.selectedIndex > 1) {
      // After create() update all Angular form data on step changes, except billing
      // postcode & country which can be set manually or via PRB callbacks.
      updateDonationFromForm(
        event,
        this.tipValue,
        this.donation,
        this.paymentGroup,
        this.amountsGroup,
        this.giftAidGroup,
        this.donationService,
        this.campaign,
        this.marketingGroup,
      );

      // And if we're about to submit, patch the donation in MatchBot and prevent submission
      // until the latest is persisted. Previously we did this after submit button press but
      // Apple Pay is highly sensitive about the wait time after the click event which caused
      // its panel to open; so we must do the work early instead.
      if (event.selectedStep.label === this.confirmStepLabel) {
        this.runFinalPreSubmitUpdate();
      }
    }

    // Create a donation if coming from first step and not offering to resume
    // an existing donation and not just patching tip amount on `donation`
    // having already gone forward then back in the form.
    if (event.previouslySelectedStep.label === this.yourDonationStepLabel) {
      if (
        !this.donation && // No change or only tip amount changed, if we got here.
        (this.previousDonation === undefined || this.previousDonation.status === 'Cancelled') &&
        event.selectedStep.label !== this.yourDonationStepLabel // Resets fire a 0 -> 0 index event.
      ) {
        // Typically an Identity captcha call has already been set off and its callback will create the donation.
        // But if we get here without a donation and with a code ready, we should create the donation now.
        if (!this.creatingDonation && this.donor) {
          this.createDonationAndMaybePerson();
        }
      }

      if (this.psp === 'stripe' && this.donation) {
        // Whether the donation's new or not, we need Stripe ready including an expected `amount` based
        // on the latest core donation + tip values.
        this.prepareStripeElements();
      }

      return;
    }

    // Default billing postcode to home postcode when Gift Aid's being claimed and so it's set.
    if (this.paymentGroup && event.previouslySelectedStep.label === 'Gift Aid' && this.giftAidGroup.value.giftAid) {
      this.paymentGroup.patchValue({
        billingPostcode: this.giftAidGroup.value.homePostcode,
      });
    }

    if (
      event.selectedIndex > this.paymentStepIndex &&
      this.donor &&
      this.donation
    ) {
      this.updateNewPersonInBackend(this.donation);
    }
  }

  /**
   * Updates the name and email address of the new person in the backend. Required at this stage for
   * the email address in particular so that there will be a ready to use email verification token
   * for when the donation is confirmed.
   */
  private updateNewPersonInBackend(donation: Donation) {
    const idAndJWT = this.identityService.getIdAndJWT();
    if (!idAndJWT) {
      console.error("Missing auth info, can't push person update to backend")
      return;
    }

    if (this.identityService.isTokenForFinalisedUser(idAndJWT.jwt)) {
      // Donor already has a password so we don't need to set their account details.
      return;
    }

    const person = this.buildPersonFromDonation(donation);
    person.id = idAndJWT.id;

    this.identityService.update(person)
      .subscribe({
        next: person => {
          this.donor = person;
        },
        error: (error: HttpErrorResponse) => {
          // For now we probably don't really need to inform donors if we didn't patch their Person data, and just won't ask them to
          // set a password if the first step failed. We'll want to monitor Analytics for any patterns suggesting a problem in the logic though.
          this.matomoTracker.trackEvent('identity_error', 'person_core_data_update_failed', `${error.status}: ${error.message}`);
        },
      });
  }

  private buildPersonFromDonation(donation: Donation): Person {
    const idAndJWT = this.identityService.getIdAndJWT();

    const person: Person = {
      id: idAndJWT!.id,
      email_address: donation.emailAddress,
      first_name: donation.firstName,
      last_name: donation.lastName,
    };

    if (donation.giftAid) {
      person.home_address_line_1 = donation.homeAddress;
      person.home_postcode = donation.homePostcode === OVERSEAS ? undefined : donation.homePostcode;
      person.home_country_code = donation.homePostcode === OVERSEAS ? OVERSEAS : 'GB';
    }

    return person;
  }

  private runFinalPreSubmitUpdate() {
    // Even if next guard fails, we want to prevent attempting to pay.
    this.runningFinalPreSubmitUpdate = true;

    const requiredDonationProperties = [this.donation, this.campaign, this.campaign.charity.id, this.psp];
    // Set class prop `donationUpdateError` true if any required props missing.
    requiredDonationProperties.forEach((value, index) => {
      if (!value) {
        const errorCodeDetail = `[code A${index}]`; // Data at `requiredDonationProperties` index `index` absent.
        const errorMessage = `Missing donation information – please refresh and try again, or email hello@biggive.org quoting ${errorCodeDetail} if this problem persists`;

        this.matomoTracker.trackEvent(
          'donate_error',
          'submit_missing_donation_basics',
          `Donation not set or form invalid ${errorCodeDetail}`,
        );
        this.toast.showError(errorMessage);
        this.donationUpdateError = true;
        this.stripeError = errorMessage;
        this.stripeResponseErrorCode = undefined;
      }
    });

    // First part of clause should be redundant but TS doesn't track enough to know that(?)
    if (!this.donation || this.donationUpdateError) {
      return;
    }

    if (this.paymentGroup.value.billingPostcode) {
      this.donation.billingPostalAddress = this.paymentGroup.value.billingPostcode;
      this.donation.countryCode = this.paymentGroup.value.billingCountry;
      this.donationService.updateLocalDonation(this.donation);
    }

    this.donationService.update(this.donation)
      .pipe(retry({ count: 3, delay: getDelay() }))
      .subscribe({
        next: async (donation: Donation) => {
          this.donationService.updateLocalDonation(donation);
          this.runningFinalPreSubmitUpdate = false;
        },
        error: (response: HttpErrorResponse) => {
          let errorMessageForTracking: string;
          if (response.message) {
            errorMessageForTracking = `Could not update donation for campaign ${this.campaignId}: ${response.message}`;
          } else {
            // Unhandled 5xx crashes etc.
            errorMessageForTracking = `Could not update donation for campaign ${this.campaignId}: HTTP code ${response.status}`;
          }
          this.matomoTracker.trackEvent('donate_error', 'donation_update_failed', errorMessageForTracking);
          this.retrying = false;
          this.donationUpdateError = true;
          this.toast.showError("Sorry, we can't submit your donation right now.");
          this.submitting = false;
        }
      });
  }

  /**
   * According to stripe docs https://stripe.com/docs/js/element/events/on_change?type=paymentElement the change event has
   * a value key as expected here. I'm not sure why that isn't included in the TS StripeElementChangeEvent interface.
   */
  async onStripeCardChange(state: StripeElementChangeEvent & ({value: {type: string, payment_method?: PaymentMethod} | undefined})) {
    this.addStripeCardBillingValidators();

    // Re-evaluate stripe card billing validators after being set above.
    // This should remove old errors after card details change, e.g. it
    // should remove an invalid post-code error in such a scenario.
    this.paymentGroup.controls.billingPostcode!.updateValueAndValidity();

    this.stripeManualCardInputValid = this.stripePaymentMethodReady = state.complete;
    this.paymentReadinessTracker.onStripeCardChange(state);

    if (state.error) {
      this.stripeError = getStripeFriendlyError(state.error, 'card_change');
      this.toast.showError(this.stripeError);
      this.stripeResponseErrorCode = state.error.code;
    } else {
      this.stripeError = undefined; // Clear any previous card errors if number fixed.
      this.stripeResponseErrorCode = undefined;
    }

    const isCard = state.value?.type === 'card';
    const selectedSavedPaymentMethod = state.value?.payment_method
    this.showCardReuseMessage = isCard && ! selectedSavedPaymentMethod && ! this.donor?.has_password;

    this.isSavedPaymentMethodSelected = !!selectedSavedPaymentMethod;
    if (selectedSavedPaymentMethod) {
      this.updateFormWithBillingDetails(selectedSavedPaymentMethod);
    }

    // Jump back if we get an out of band message back that the card is *not* valid/ready.
    // Don't jump forward when the card *is* valid, as the donor might have been
    // intending to edit something else in the `payment` step; let them click Next.
    // We need to check the current index in the stepper because we've seen this fire as soon
    // as the step *before* 'Payment details' loads and initialises the Stripe Payment element.
    if (!this.donation || !this.stripePaymentMethodReady || !this.stripePaymentElement || !this.stripeElements) {
      if (this.stepper.selectedIndex > this.paymentStepIndex) {
        this.jumpToStep('Payment details');
      }

      return;
    }

    if (state.value) {
      this.selectedPaymentMethodType = state.value.type;
    }
  }

  async submit() {
    // Can't proceed if donation or campaign data issue. Prior check fn has already reported the issue.
    if (this.donationUpdateError) {
      // A more specific toast, and corresponding Matomo log, should have fired as donor entered Confirm.
      this.toast.showError('Sorry, cannot process your payment due to the previous error');
      return;
    }

    if (this.donationForm.invalid) {
      // Form invalid but submitted may mean enter was pressed inside Stripe.js. Best action
      // is to simply not submit yet.
      this.toast.showError('Please complete the remaining fields to submit your donation.');
      this.matomoTracker.trackEvent(
        'donate_error',
        'submit_while_invalid',
        `Donation form invalid, maybe because of early Stripe enter submit`,
      );
      return;
    }

    this.submitting = true;
    await this.payWithStripe();
  }

  payWithStripe = async () => {
    const hasCredit = this.creditPenceToUse > 0;

    const methodIsReady = this.stripePaymentElement || hasCredit;

    if (!this.donation || !methodIsReady) {
      this.stripeError = 'Missing data from previous step – please refresh and try again';
      this.toast.showError(this.stripeError);
      this.stripeResponseErrorCode = undefined;
      this.matomoTracker.trackEvent('donate_error', 'stripe_pay_missing_secret', `Donation ID: ${this.donation?.donationId}`);
      return;
    }

    if (hasCredit) {
      // Settlement is via the Customer's cash balance, with no client-side provision of a Payment Method.
      this.donationService.finaliseCashBalancePurchase(this.donation).subscribe({
        next: async (donation) => {
          this.matomoTracker.trackEvent(
            'donate',
            'stripe_customer_balance_payment_success',
            `Stripe Intent expected to auto-confirm for donation ${donation.donationId} to campaign ${donation.projectId}`,
          );
          await this.exitPostDonationSuccess(donation, 'donation-funds');
        },
        error: (response: HttpErrorResponse) => {
          // I think this is the path to a detailed message in MatchBot `ActionError`s.
          const errorMsg = response.error?.error?.description;

          this.matomoTracker.trackEvent(
            'donate_error',
            'stripe_customer_balance_payment_error',
            errorMsg ?? '[No message]',
          );
          this.stripeError = 'Your donation has not been processed as it seems you have insufficient funds. Please refresh the page to see your remaining balance.';
          this.toast.showError(this.stripeError);
        },
      });

      return;
    }

    let result:
      {
        paymentIntent?: undefined | { status: PaymentIntent.Status; client_secret: string | null },
        error?: undefined,
      } |
      { error: StripeError } |
      undefined;

    if (!this.stripeElements) {
      throw new Error("Missing stripe elements");
    }

    const confirmationTokenResult: ConfirmationTokenResult = await this.stripeService.prepareConfirmationTokenFromPaymentElement(
      {countryCode: this.donation.countryCode!, billingPostalAddress: this.donation.billingPostalAddress!},
      this.stripeElements
    );

    const confirmationToken = confirmationTokenResult.confirmationToken;

    if (confirmationToken) {
      try {
        result = await firstValueFrom(this.donationService.confirmCardPayment(this.donation, {confirmationToken}));
      } catch (httpError) {
        this.matomoTracker.trackEvent(
          'donate_error',
          'stripe_confirm_failed',
          (httpError as HttpErrorResponse).error?.error?.code,
        );

        this.handleStripeError((httpError as HttpErrorResponse).error?.error, 'confirm');

        return;
      }

      if (result?.paymentIntent && result.paymentIntent.status === 'requires_action') {
        if (!result.paymentIntent.client_secret) {
          throw new Error("payment intent requires action but client secret missing")
        }

        const {
          error,
        } = await this.stripeService.handleNextAction(result.paymentIntent!.client_secret);
        if (error) {
          // Next action (e.g. 3D Secure) was run by Stripe.js, and failed.
          result = {error: error};
          this.submitting = false;

          // As the donation is now attached to a payment intent that will have status requires_action, its not really
          // usable. Stripe won't allow that PI to be confirmed, and the donor may want to try a different card. Best we
          // can do is clear the donation out and let them start a new one.

          this.refreshDonationAndStripe();
        } else {
          await this.exitPostDonationSuccess(this.donation, this.selectedPaymentMethodType);
          return;
        }
      } // Else there's a `paymentMethod` which is already successful or errored » both handled later.
    } else {
      result = {error: confirmationTokenResult?.error};
    }

    if (!result || result.error) {
      // Client-side issue that wasn't a next_action should be a `prepareMethodFromPaymentElement()`
      // problem.
      if (result) {
        this.matomoTracker.trackEvent(
          'donate_error',
          'stripe_token_result_error',
          result.error.message,
        );
        this.handleStripeError(result.error, 'method_setup');
      }

      this.submitting = false;
      return;
    }

    if (!result.paymentIntent) {
      this.matomoTracker.trackEvent('donate_error', 'stripe_pay_missing_pi', 'No error or paymentIntent');
      return;
    }

    // See https://stripe.com/docs/payments/intents
    if (['succeeded', 'processing'].includes(result.paymentIntent.status)) {
      await this.exitPostDonationSuccess(this.donation, this.selectedPaymentMethodType);
      return;
    }

    // else Intent 'done' but not a successful status.
    this.matomoTracker.trackEvent('donate_error', 'stripe_intent_not_success', result.paymentIntent.status);
    this.stripeError = `Payment error - Status: ${result.paymentIntent.status}`;
    this.toast.showError(this.stripeError);
    this.stripeResponseErrorCode = undefined;
    this.submitting = false;
  };

  get donationAmountField() {
    if (!this.donationForm) {
      return undefined;
    }

    return this.donationForm.controls.amounts!.get('donationAmount');
  }

  get tipAmountField() {
    if (!this.donationForm) {
      return undefined;
    }

    return this.donationForm.controls.amounts!.get('tipAmount');
  }

  /**
   * Gift Aid step is only shown (at step index 1) when campaign is in GBP.
   */
  get paymentStepIndex() {
    return this.campaign.currencyCode  === 'GBP' ? 2 : 1;
  }

  /**
   * Quick getter for donation amount, to keep template use concise.
   */
  get donationAmount(): number {
    return sanitiseCurrency(this.amountsGroup.value.donationAmount?.trim());
  }

  /**
   * Donation plus any tip and/or fee cover.
   */
  get donationAndExtrasAmount(): number {
    // Replicates logic of \MatchBot\Domain\Donation::getAmountFractionalIncTip . Consider further DRYing in future.
    return this.donationAmount + this.tipAmount();
  }

  /**
   * Called when ever we set this.donationCreateError = true. For now its all one error message but we may want to
   * replace some of the calls with a different more specific message that identifies the cause of the problem if it will
   * either help donors directly or if they might usefully quote it to us in a support case.
   */
  showDonationCreateError() {
    this.toast.showError(
        "Sorry, we can't register your donation right now. Please try again in a moment or contact " +
        " us if this message persists."
    )
  }

  captchaIdentityReturn(captchaResponse: string | null) {
    if (captchaResponse === null) {
      // Ensure no other callback tries to use the old captcha code, and will re-execute
      // the catcha to get a new one as needed instead.

      // Blank returns happen e.g. on prompt and on expiry. So even when we know a puzzle was just
      // opened we can't safely show an incomplete puzzle error based on this callback.
      this.idCaptchaCode = undefined;
      return;
    }

    if (this.stepChangeBlockedByCaptcha) {
      this.stepper.next();
      this.stepChangeBlockedByCaptcha = false;
    }

    this.markYourDonationStepComplete();

    this.idCaptchaCode = captchaResponse;
    if (!this.donation && this.donationAmount > 0) {
      this.createDonationAndMaybePerson();
    }
  }

  customTip(): boolean {
    return this.amountsGroup.value.tipPercentage === 'Other';
  }

  expectedMatchAmount(): number {
    if (!this.donation) {
      return 0;
    }

    return this.donation.matchReservedAmount;
  }

  giftAidAmount(): number {
    return this.giftAidGroup.value.giftAid ? (GIFT_AID_FACTOR * this.donationAmount) : 0;
  }

  tipAmount(): number {
    if (typeof this.tipValue === 'number') {
      return this.tipValue;
    }

    console.error("We should never be hitting this, the tipValue should now always be set to an number");
    return sanitiseCurrency(this.amountsGroup.value.tipAmount);
  }

  expectedTotalAmount(): number {
    return this.donationAmount + this.giftAidAmount() + this.expectedMatchAmount();
  }

  /**
   * If `el` is a focusable input, it is usually a good idea to `focus()` it after calling
   * this to help with correction, especially for screen readers.
   */
  scrollTo(el: HTMLElement): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Percentage selection changed by donor, as opposed to programatically.
   */
  tipPercentageChange() {
    this.tipPercentageChanged = true;
  }

  interceptSubmitAndProceedInstead(event: Event) {
    event.preventDefault();
    this.next();
  }

  next() {
    // If the initial donation *create* has failed, we want to try again each time,
    // not just re-surface the existing error. The step change event is what
    // leads to the DonationService.create() [POST] call. Note that just setting the
    // bool and letting `goToFirstVisibleError()` proceed doesn't work on the first
    // click, probably because that method needs a refreshed DOM to detect if custom
    // error elements are still present. So the safest fix for now is to skip it
    // when we know we have only just hidden the error in this call.
    if (this.donationCreateError && this.stepper.selected?.label === this.yourDonationStepLabel) {
      if (this.donation) {
        this.clearDonation(this.donation, {clearAllRecord: true, jumpToStart: true});
        this.matomoTracker.trackEvent(
          'donate',
          'create_retry',
          `Donation cleared ahead of creation retry for campaign ${this.campaignId}`,
        );
      }
      this.donationCreateError = false;
      this.stepper.next();
      return;
    }
    this.stripePaymentMethodReady = this.stripeManualCardInputValid || this.creditPenceToUse > 0;

    const promptingForCaptcha = this.promptForCaptcha();

    if (promptingForCaptcha) {
      this.stepChangeBlockedByCaptcha = true;
      return;
    }

    // For all other errors, attempting to proceed should just help the donor find
    // the error on the page if there is one.
    if (!this.goToFirstVisibleError()) {
      this.stepper.next();
    }
  }

  /**
   * Validates the `amounts` group, then calls the general step change fn `next()`. Used by both
   * the first Continue button and by the step header click handler, which I think helped guard
   * against a scenario where one might get 'stuck' without seeing the amount error that explains why.
   */
  progressToNonAmountsStep() {
    const success = this.validateAmountsCreateDonorDonationIfPossible();

    success && this.next();
  }

  private validateAmountsCreateDonorDonationIfPossible(): boolean {
    const control = this.donationForm.controls['amounts'];
    if (!control!.valid) {
      this.toast.showError(this.displayableAmountsStepErrors() || 'Sorry, there was an error with the donation amount or tip amount');

      return false;
    }

    if (!this.donation && (this.idCaptchaCode || this.donor) && this.donationAmount > 0) {
      this.createDonationAndMaybePerson();
    }

    return true;
  }

  progressFromStepGiftAid(): void {
    this.triedToLeaveGiftAid = true;
    const giftAidRequiredRadioError = this.giftAidRequiredRadioError();
    const errorMessages = giftAidRequiredRadioError ? [giftAidRequiredRadioError] : [];

    const homeAddressErrors = this.giftAidGroup?.controls?.homeAddress?.errors;
    if (homeAddressErrors?.required) {
      errorMessages.push("Please enter your home address");
    }

    if (homeAddressErrors?.maxlength) {
      errorMessages.push(`Please enter your address in ${homeAddressErrors.maxlength.requiredLength} characters or less`);
    }

    const homePostcodeErrors = this.giftAidGroup?.controls?.homePostcode?.errors;
    if (homePostcodeErrors?.required) {
      errorMessages.push("Please enter your home postcode");
    }

    if (homePostcodeErrors?.pattern) {
      errorMessages.push("Please enter a UK postcode");
    }

    if (errorMessages.length > 0) {
      this.toast.showError(errorMessages.join(". "));
      return;
    }

    this.next()
  }

  progressFromStepReceiveUpdates(): void {
    this.triedToLeaveMarketing = true;
    const errorMessages = Object.values(this.errorMessagesForMarketingStep()).filter(Boolean)
    if (errorMessages.length > 0) {
      this.toast.showError(errorMessages.join(" "));
      return;
    }

    this.next()
  }

  public errorMessagesForMarketingStep = () => {
    return {
      optInChampionEmailRequired: this.marketingGroup.get('optInChampionEmail')?.hasError('required') ?
        `Please choose whether you wish to receive updates from ${this.campaign.championName}.` : null,

      optInTbgEmailRequired: this.marketingGroup.get('optInTbgEmail')?.hasError('required') ?
        'Please choose whether you wish to receive updates from Big Give.' : null,

      optInCharityEmailRequired: this.marketingGroup.get('optInCharityEmail')?.hasError('required') ?
        `Please choose whether you wish to receive updates from ${this.campaign.charity.name}.` : null
    };
  }


  public giftAidRequiredRadioError = (): string => {
    if (this.giftAidGroup.get('giftAid')?.hasError('required')) {
      return 'Please choose whether you wish to claim Gift Aid.'
    }

    return '';
  }

  /**
   * @todo - refactor to make friendly by combining messages re donation amount and re tip errors -
   * we should show both at once if necassary. But one at a time may do for this weekend.
   */
  public displayableAmountsStepErrors = () => {
    const donationAmountErrors = this.donationAmountField?.errors;
    const tipErrors = this.tipAmountField?.errors;

    if (! donationAmountErrors && ! tipErrors) {
      return '';
    }

    if (donationAmountErrors?.min) {
      return `Sorry, the minimum donation is ${this.currencySymbol}1.`;
    }

    if (donationAmountErrors?.max) {
      return `Your donation must be ${this.currencySymbol}${this.maximumDonationAmount} or less to proceed.`
        + (
          this.creditPenceToUse === 0 ?
            ` You can make multiple matched donations of ` +
            `${this.currencySymbol}${this.maximumDonationAmount} if match funds are available.`
            : ''
        );
    }

    if (donationAmountErrors?.pattern) {
      return `Please enter a whole number of ${this.currencySymbol} without commas.`
    }

    if (donationAmountErrors?.required) {
      return 'Please enter how much you would like to donate.';
    }

    // todo - refactor tip messages below to remove duplication.
    if (tipErrors?.pattern) {
      return "Please enter how much you would like to donate to Big Give as a number of £, optionally with 2 decimals and up to £25,000."
    }

    if (tipErrors?.required) {
      return "Please enter how much you would like to donate to Big Give."
    }

    const message = "Sorry, something went wrong with the form - please try again or contact Big Give";
    console.error(message);
    return message;
  };

  onBillingPostCodeChanged(_: Event) {
    // If previous payment attempt failed due to incorrect post code
    // and the post code has just been changed again, clear stripeError
    // and clear stripeResponseErrorCode. This is because if we don't,
    // then when the user goes back to the Payment details step and
    // updates their post code, pressing the 'Next' button will keep them
    // where they are and not proceed them to the next step, because the
    // next() method calls goToFirstVisibleError().
    if (this.isBillingPostcodePossiblyInvalid()) {
      this.stripeError = undefined;
      this.stripeResponseErrorCode = undefined;
    }
  }

  private prepareStripeElements() {
    if (!this.donation) {
      console.log('Donation not ready for Stripe');
      return;
    }

    if (this.stripeElements) {
      this.stripeService.updateAmount(this.stripeElements, this.donation);
    } else {
      this.stripeElements = this.stripeService.stripeElementsForDonation(
        this.donation,
        this.campaign,
        this.donationService.stripeSessionSecret
      );
    }

    if (this.stripePaymentElement) {
      // Payment element was already ready & we presume mounted.
      return;
    }

    const stripeElements = this.stripeElements;
    this.stripePaymentElement = StripeService.createStripeElement(stripeElements);

    if (this.cardInfo && this.stripePaymentElement) {
      this.stripePaymentElement.mount(this.cardInfo.nativeElement);
      // @ts-ignore Not sure why only 'loaderstart' sig is recognised now.
      this.stripePaymentElement.on('change', this.cardHandler);
    }
  }

  private markYourDonationStepIncomplete() {
    const step = this.stepper.steps.get(0);
    if (!step) {
      throw new Error('Step 0 not found');
    }

    step.completed = false;
  }

  private markYourDonationStepComplete() {
    const step = this.stepper.steps.get(0);
    if (!step) {
      throw new Error('Step 0 not found');
    }

    step.completed = true;
  }

  private destroyStripeElements() {
    if (this.stripePaymentElement) {
      this.stripePaymentElement.off('change');
      this.stripePaymentElement.destroy();
      this.stripePaymentElement = undefined;
      this.stripeElements = undefined;
    }
  }

  /**
   * Updates the balance of donation credits available for use, and connected readiness + validation vars.
   */
  private prepareDonationCredits(person: Person) {
    if (environment.creditDonationsEnabled && person.cash_balance && person.cash_balance[this.campaign.currencyCode.toLowerCase()]! > 0) {
      this.creditPenceToUse = parseInt(
        person.cash_balance[this.campaign.currencyCode.toLowerCase()]!.toString() as string,
        10
      );
      this.maximumDonationAmount = maximumDonationAmount(this.campaign.currencyCode, this.creditPenceToUse);
      this.stripePaymentMethodReady = true;
      this.paymentReadinessTracker.donationFundsPrepared(this.creditPenceToUse);
      this.setConditionalValidators();

      if (this.donation && this.donation.pspMethodType !== "customer_balance") {
        // We can't convert card donation to a customer balance donation, and the donor should choose the amount
        // bearing in mind what they have in the balance, so:
        this.donationService.cancel(this.donation);
        delete this.donation;
        this.stepper.reset();
      }
    }
  }

  private prefillRarelyChangingFormValuesFromPerson(person: Person) {
    this.giftAidGroup.patchValue({
      homeAddress: person.home_address_line_1,
      homeOutsideUK: person.home_country_code !== null && person.home_country_code !== 'GB',
      homePostcode: person.home_postcode,
    });

    this.paymentGroup.patchValue({
      firstName: person.first_name,
      lastName: person.last_name,
      emailAddress: person.email_address,
    });
  }

  private updateFormWithBillingDetails(paymentMethod: PaymentMethod) {
    const billingDetails = paymentMethod.billing_details;
    this.paymentGroup.patchValue({
      billingCountry: billingDetails.address?.country,
      billingPostcode: billingDetails.address?.postal_code,
    });

    this.stripePaymentMethodReady = true;
  }

  private handleStripeError(
    error: StripeError | {message: string, code: string, decline_code?: string} | undefined,
    context: 'method_setup'| 'card_change'| 'confirm',
  ) {
    this.submitting = false;
    this.stripeError = getStripeFriendlyError(error, context);
    this.toast.showError(this.stripeError);
    this.stripeResponseErrorCode = error?.code;

    this.jumpToStep('Payment details');
    this.goToFirstVisibleError();
  }

  private isBillingPostcodePossiblyInvalid() {
    return this.stripeResponseErrorCode === 'card_declined';
  }

  private jumpToStep(stepLabel: string) {
    this.stepper.steps
      .filter(step => step.label === stepLabel)
      [0]!
      .select();

    this.cd.detectChanges();
  }

  /**
   * @returns whether any errors were found in the visible viewport.
   */
  private goToFirstVisibleError(): boolean {
    const stepper = this.elRef.nativeElement.querySelector('#stepper');
    const steps = stepper.getElementsByClassName('mat-step');
    const stepJustDone = steps[this.stepper.selectedIndex];

    // We ought to update value + validity after any validation changes, which will hopefully fix incorrently trying to surface
    // `.ng-invalid` elements anyway. But to be safe, we also now check that the input actually been interacted with and is
    // currently visible to the donor.
    const firstElInStepWithAngularError = stepJustDone.querySelector('.ng-invalid.ng-touched[formControlName]');
    if (firstElInStepWithAngularError && !this.closeAncestorsHaveDisplayNone(firstElInStepWithAngularError)) {
      this.scrollTo(firstElInStepWithAngularError);
      firstElInStepWithAngularError.focus();
      return true;
    }

    const firstCustomError = stepJustDone.querySelector('.error');
    if (firstCustomError) {
      this.scrollTo(firstCustomError);
      return true;
    }

    return false;
  }

  private getCurrencySymbol(currencyCode: string): string {
    return Intl.NumberFormat('en-GB', {style:'currency', currency: currencyCode})
      .formatToParts()
      .find(part => part.type === 'currency')
      ?.value || '';
  }

  private setCampaignBasedVars() {
    this.campaignId = this.campaign.id;

    // We want to let donors finish the journey if they're on the page before the campaign
    // close date and it passes while they're completing the form – in particular they should
    // be able to use match funds secured until 30 minutes after the close time.

    this.currencySymbol = this.getCurrencySymbol(this.campaign.currencyCode);

    if (environment.psps.stripe.enabled && this.campaign.charity.stripeAccountId) {
      this.psp = 'stripe';
    } else {
      this.noPsps = true;
    }

    if (this.campaign.championOptInStatement) {
      this.showChampionOptIn = true;
    }

    if (this.campaign.hidden) {
      this.toast.showError(campaignHiddenMessage);
    }
  }

  private handleCampaignViewUpdates() {
    if (this.campaign.currencyCode === 'GBP') {
      this.addUKValidators();
    }

    this.setConditionalValidators();
    this.setChampionOptInValidity();

    this.pageMeta.setCommon(
      `Donate to ${this.campaign.charity.name}`,
      `Donate to the "${this.campaign.title}" campaign`,
      this.campaign.bannerUri,
    );
  }

  private createDonationAndMaybePerson(): void {
    clearTimeout(this.donationRetryTimeout);
    if (this.creatingDonation) { // Ensure only 1 trigger is doing this at a time.
      return;
    }

    if (!this.donor && !this.idCaptchaCode) {
      this.markYourDonationStepIncomplete();
      return;
    }

    if (!this.campaign || !this.campaign.charity.id || !this.psp) {
      this.donationCreateError = true;
      this.showDonationCreateError();
      return;
    }

    this.creatingDonation = true;
    this.donationCreateError = false;

    // Donations are now made on behalf of a Person, and we use an ID captcha to validate that we're
    // dealing with a real person at that stage.
    const donation: Donation = {
      charityId: this.campaign.charity.id,
      charityName: this.campaign.charity.name,
      countryCode: this.paymentGroup?.value.billingCountry || 'GB',
      currencyCode: this.campaign.currencyCode || 'GBP',
      donationAmount: this.donationAmount,
      donationMatched: this.campaign.isMatched,
      matchedAmount: 0, // Only set >0 after donation completed
      matchReservedAmount: 0, // Only set >0 after initial donation create API response
      pspMethodType: this.getPaymentMethodType(),
      projectId: this.campaignId,
      psp: this.psp,
      tipAmount: sanitiseCurrency(this.amountsGroup.value.tipAmount?.trim()),
    };

    if (this.donor?.id) {
      donation.pspCustomerId = this.identityService.getPspId();
    }

    // Person already set up on page load.
    if (this.donor?.id) {
      this.createDonation(donation);
    } else {
      const person = {
        captcha_code: this.idCaptchaCode,
        captcha_type: 'friendly_captcha',
        raw_password: undefined,
      } satisfies Person;

      this.identityService.create(person).subscribe(
        (person: Person) => {
          // would like to move the line below inside `identityService.create` but that caused test errors when I tried
          this.identityService.saveJWT(person.id as string, person.completion_jwt as string);
          this.donor = person;
          donation.pspCustomerId = person.stripe_customer_id;
          this.createDonation(donation);
        },
        (error: HttpErrorResponse) => {
          // In ID-on mode, we can't proceed without the Person/Stripe Customer.
          this.matomoTracker.trackEvent('identity_error', 'person_create_failed', `${error.status}: ${error.message}`);
          this.creatingDonation = false;
          this.donationCreateError = true;
          this.friendlyCaptchaWidget?.reset();
          this.showDonationCreateError();
          this.stepper.previous(); // Go back to step 1 to make the general error for donor visible.
        }
      )
    }
  }

  /**
   * @return boolean True if prompting, false if there is no need to prompt as we already have captcha code.
   * @private
   */
  private promptForCaptcha() {
    if (this.idCaptchaCode) {
      return false;
    }

    if (this.donation) {
      // No need for a captcha if the donation is already created.
      return false;
    }

    this.markYourDonationStepIncomplete();

    this.toast.showError("Please wait, running captcha check to prevent spam")
    return true;
  }

  /**
   * Creates a Donation itself. Both success and error callbacks should unconditionally set `creatingDonation` false.
   */
  private createDonation(donation: Donation) {
    // No re-tries for create() where donors have only entered amounts. If the
    // server is having problem it's probably more helpful to fail immediately than
    // to wait until they're ~10 seconds into further data entry before jumping
    // back to the start.
    this.donationService.create(donation, this.donor?.id, this.identityService.getJWT())
    .subscribe({
      next: this.newDonationSuccess.bind(this),
      error: this.newDonationError.bind(this),
    });
  }

  private newDonationError(response: HttpErrorResponse) {
    const retry_in_seconds = response.error.retry_in;

    if (retry_in_seconds && retry_in_seconds <= 35 && ! this.donationRetryTimeout) {
      // this means we were prevented from creating a donation by a rate limit. Its short enough that we can usefully
      // retry. If the retry fails we show the user an error.
      this.creatingDonation = false;
      this.donation = undefined;

      this.donationRetryTimeout = window.setTimeout(() => this.createDonationAndMaybePerson(), +retry_in_seconds * 1_000)
      return;
    }

    let errorMessage: string;
    if (response.message) {
      errorMessage = `Could not create new donation for campaign ${this.campaignId}: ${response.message}`;
    } else {
      // Unhandled 5xx crashes etc.
      errorMessage = `Could not create new donation for campaign ${this.campaignId}: HTTP code ${response.status}`;
    }
    this.matomoTracker.trackEvent('donate_error', 'donation_create_failed', errorMessage);
    this.creatingDonation = false;
    this.donationCreateError = true;
    this.showDonationCreateError();
    this.stepper.previous(); // Go back to step 1 to surface the internal error.
  }

  private newDonationSuccess(response: DonationCreatedResponse) {
    this.creatingDonation = false;

    const createResponseMissingData = (
      !response.donation.charityId ||
      !response.donation.donationId ||
      !response.donation.projectId
    );
    if (createResponseMissingData) {
      this.matomoTracker.trackEvent(
        'donate_error',
        'donation_create_response_incomplete',
        `Missing expected response data creating new donation for campaign ${this.campaignId}`,
      );
      this.donationCreateError = true;
      this.showDonationCreateError();
      this.stepper.previous(); // Go back to step 1 to surface the internal error.

      return;
    }

    this.donationService.saveDonation(response);
    this.donation = response.donation; // Simplify update() while we're on this page.
    this.donationChangeCallBack(this.donation)

    this.matomoTracker.trackEvent(
      `donate_amount_chosen_${this.campaign.currencyCode}`,
      `Donation to campaign ${this.campaignId}`,
      `donation_${this.campaignId}`,
      response.donation.donationAmount,
    );

    if (response.donation.tipAmount > 0) {
      this.matomoTracker.trackEvent(
        `tip_amount_chosen_${this.campaign.currencyCode}`,
        `Tip alongside donation to campaign ${this.campaignId}`,
        `tip_with_${this.campaignId}`,
        response.donation.tipAmount,
      );
    }

    if (this.psp === 'stripe') {
      if (this.creditPenceToUse > 0) {
        this.paymentReadinessTracker.donorHasFunds();
        this.stripePaymentMethodReady = true;
      } else {
        this.prepareStripeElements();
      }
    }

    if (
      environment.environmentId !== "regression" ||
      (new URLSearchParams(window.location.search)).has('include-continue-prompt')
    ) {
      // Prompting to continue confuses the regression test automation, so we skip the prompt in the regression
      // test environment at least for the time being. See JIRA REG-33 . When regression tests think they know how to
      // deal with the prompts they can send the include-continue-prompt query string.

      // Amount reserved for matching is 'false-y', i.e. 0
      if (response.donation.donationMatched && !response.donation.matchReservedAmount) {
        this.promptToContinueWithNoMatchingLeft(response.donation);
        return;
      }

      // Amount reserved for matching is > 0 but less than the full donation
      if (response.donation.donationMatched && response.donation.matchReservedAmount < response.donation.donationAmount) {
        this.promptToContinueWithPartialMatching(response.donation);
        return;
      }
    }

    this.scheduleMatchingExpiryWarning(this.donation);
  }

  private offerExistingDonation(donation: Donation) {
    this.matomoTracker.trackEvent('donate', 'existing_donation_offered', `Found pending donation to campaign ${this.campaignId}`);

    // Ensure we do not claim match funds are reserved when offering an old
    // donation if the reservation time is up. See also the on-page-timeout counterpart
    // in `this.expiryWarning`'s timeout callback.
    if (
      donation.matchReservedAmount > 0 &&
      donation.createdTime &&
      (environment.reservationMinutes * 60000 + new Date(donation.createdTime).getTime()) < Date.now()
    ) {
      donation.matchReservedAmount = 0;
    }

    const reuseDialog = this.dialog.open(DonationStartOfferReuseDialogComponent, {
      data: { donation },
      disableClose: true,
      role: 'alertdialog',
    });
    reuseDialog.afterClosed().subscribe({ next: this.getDialogResponseFn(donation) });
  }

  private scheduleMatchingExpiryWarning(donation: Donation) {
    // Only set the timeout when relevant part 1/2: exclude cases with no
    // matching.
    if (!donation.createdTime || donation.matchReservedAmount <= 0) {
      return;
    }

    // If we called this but already had a warning timer, the old one should
    // be irrelevant because typically we'd invoke this after offering an existing
    // donation and the donor saying yes. Even if we have prompted about the
    // same donation for which we were already counting down a timer, removing
    // and replacing it should be an idempotent process and so is the safest,
    // least brittle option here.
    this.cancelExpiryWarning();

    // To make this safe to call for both new and resumed donations, we look up
    // the donation's creation time and determine the timeout based on that rather
    // than e.g. always using 30 minutes.
    const msUntilExpiryTime = environment.reservationMinutes * 60000 + new Date(donation.createdTime).getTime() - Date.now();

    // Only set the timeout when relevant part 2/2: exclude cases where
    // the timeout has already passed. This happens e.g. when the reuse
    // dialog is shown because of matching expiry and the donor chooses
    // to continue anyway without matching.
    if (msUntilExpiryTime < 0) {
      return;
    }

    this.expiryWarning = setTimeout(() => {
      if (!this.donation) {
        return;
      }

      // The expiry's happened, so we should ignore the amount of funds returned by the API
      // and set this to 0. See also offerExistingDonation() which does the equivalent for donation
      // loaded from browser storage into a new load of this page.
      this.donation.matchReservedAmount = 0;

      const continueDialog = this.dialog.open(DonationStartMatchingExpiredDialogComponent, {
        disableClose: true,
        role: 'alertdialog',
      });
      continueDialog.afterClosed().subscribe(this.getDialogResponseFn(donation));
    }, msUntilExpiryTime);
  }

  private cancelExpiryWarning() {
    if (this.expiryWarning) {
      clearTimeout(this.expiryWarning);
      delete this.expiryWarning;
    }
  }

  /**
   * Also resets captcha & relevant donation persistence state mgmt,
   * and returns to step 1 so required input can be collected again.
   * We DON'T reset `this.donor`, so there should be no need for a new captcha code.
   *
   * @param clearAllRecord  Don't keep donation around for /thanks/... or reuse.
   * @param jumpToStart     If the caller is already setting up a known-value donation alongside the clear,
   *                        this should be false. In other cases we need to know the new amount so it
   *                        should usually be true, if the page is not being unloaded.
   */
  private clearDonation(donation: Donation, {clearAllRecord, jumpToStart}: {clearAllRecord: boolean; jumpToStart: boolean}) {
    if (clearAllRecord) { // i.e. don't keep donation around for /thanks/... or reuse.
      this.donationService.removeLocalDonation(donation);
    }

    this.cancelExpiryWarning();

    this.creatingDonation = false;
    this.donationCreateError = false;
    this.donationUpdateError = false;

    this.retrying = false;
    this.submitting = false;

    delete this.donation;
    this.donationChangeCallBack(undefined)

    if (jumpToStart) {
      this.jumpToStep(this.yourDonationStepLabel);
    }
  }

  private promptToContinueWithNoMatchingLeft(donation: Donation) {
    this.matomoTracker.trackEvent('donate', 'alerted_no_match_funds', `Asked donor whether to continue for campaign ${this.campaignId}`);
    this.promptToContinue(
      'Great news - this charity has reached their target',
      'There are no match funds currently available for this charity.',
      'Remember, every penny helps. Please continue to make an <strong>unmatched donation</strong> to the charity!',
      'Cancel',
      donation,
      this.campaign.surplusDonationInfo,
    );
  }

  /**
   * @param donation *Response* Donation object, with `matchReservedAmount` returned
   *                    by the Donations API.
   */
  private promptToContinueWithPartialMatching(donation: Donation) {
    this.matomoTracker.trackEvent('donate', 'alerted_partial_match_funds', `Asked donor whether to continue for campaign ${this.campaignId}`);
    const formattedReservedAmount = (new ExactCurrencyPipe()).transform(donation.matchReservedAmount, donation.currencyCode);
    this.promptToContinue(
      'Not all match funds are available',
      'There aren\'t enough match funds currently available to fully match your donation. ' +
        `<strong>${formattedReservedAmount}</strong> will be matched.`,
      'Remember, every penny helps, and you can continue to make a <strong>partially matched donation</strong> to the charity!',
      'Cancel and release match funds',
      donation,
      this.campaign.surplusDonationInfo,
    );
  }

  private addUKValidators(): void {
    this.giftAidGroup.controls.giftAid!.setValidators([requiredNotBlankValidator]);
    this.giftAidGroup.updateValueAndValidity();
  }

  public updateTipAmountFromSelectedPercentage = (tipPercentage: string) => {
    if (tipPercentage === 'Other') {
      this.matomoTracker.trackEvent('donate', 'tip_other_selected', 'Tip Other Amount Selected')
      this.displayCustomTipInput();
      return;
    }
    this.showCustomTipInput = false;

    const tipOrFeeAmount = this.getTipOrFeeAmount(Number(tipPercentage), this.donationAmount);

    this.tipPercentage = Number(tipPercentage);
    this.tipValue = Number(tipOrFeeAmount);
    this.amountsGroup.patchValue({
      // Keep value consistent with format of manual string inputs.
      tipAmount: tipOrFeeAmount,
    });
  };

  private setConditionalValidators(): void {
    // Do not add a validator on `tipPercentage` because as a dropdown it always
    // has a value anyway, and this complicates repopulating the form when e.g.
    // reusing an existing donation.
    //
    // We need to listen for tip percentage
    // field changes and don't have a cover fee checkbox. We don't ask for a
    // tip on donation when using a donor's credit balance.
    if (this.creditPenceToUse === 0) {
      this.amountsGroup.controls.tipAmount!.setValidators([
        requiredNotBlankValidator,
        // We allow spaces at start and end of amount inputs because people can easily paste them in
        // by mistake, and they don't do any harm. Maxlength in the HTML makes sure there can't be so much as
        // to stop the number being visible.
        Validators.pattern('^\\s*[£$]?[0-9]+?(\\.[0-9]{1,2})?\\s*$'),
        getCurrencyMaxValidator(),
      ]);
    }

    // Reduce the maximum to the credit balance if using donor credit and it's below the global max.
    this.amountsGroup.controls.donationAmount!.setValidators([
      requiredNotBlankValidator,
      getCurrencyMinValidator(1), // min donation is £1
      getCurrencyMaxValidator(maximumDonationAmount(this.campaign.currencyCode, this.creditPenceToUse)),
      Validators.pattern('^\\s*[£$]?[0-9]+?(\\.00)?\\s*$'),
    ]);
    this.amountsGroup.get('donationAmount')?.valueChanges.subscribe((donationAmountInput: string) => {
      const updatedValues: {
        tipPercentage?: number | string,
        tipAmount?: string
      } = {};

      const donationAmount = sanitiseCurrency(donationAmountInput);

      if (!this.tipPercentageChanged) {
        let newDefault = this.tipPercentage;
        if (donationAmount >= 1000) {
          newDefault = 7.5;
        } else if (donationAmount >= 300) {
          newDefault = 10;
        } else if (donationAmount >= 100) {
          newDefault = 12.5;
        }

        updatedValues.tipPercentage = newDefault;
        updatedValues.tipAmount = this.getTipOrFeeAmount(newDefault, donationAmount);
      } else if (this.amountsGroup.get('tipPercentage')?.value !== 'Other') {
        updatedValues.tipAmount = this.getTipOrFeeAmount(this.amountsGroup.get('tipPercentage')?.value, donationAmount);
      }

      this.amountsGroup.patchValue(updatedValues);
    });
    this.amountsGroup.get('tipPercentage')?.valueChanges.subscribe(this.updateTipAmountFromSelectedPercentage);

    // Initial and post-auth validation of Gift Aid should depend upon the previous value
    // of the opt-in and 'outside UK' checkboxes. If there's no value yet, initial validators
    // should use `false`.
    this.setGiftAidValidatorsForChoice(this.giftAidGroup.value?.giftAid ?? false);

    this.giftAidGroup.get('homeOutsideUK')?.valueChanges.subscribe(homeOutsideUK => {
      this.setGiftAidValidatorsForChoice(this.giftAidGroup.value.giftAid, homeOutsideUK);
      this.updateAllValidities();
    });

    this.giftAidGroup.get('homePostcode')?.valueChanges.subscribe((homePostcode: string | null) => {
      if (homePostcode !== null) {
        const homePostcodeAsIs = homePostcode;

        // Uppercase it in-place, then we can use patterns that assume upper case.
        homePostcode = homePostcode.toUpperCase();
        var parts = homePostcode.match(postcodeFormatHelpRegExp);
        if (parts === null) {
          // If the input doesn't even match the much looser pattern here, it's going to fail
          // the validator check in a moment and there's nothing we can/should do with it
          // formatting-wise.
          return;
        }
        parts.shift();
        const formattedPostcode = parts.join(' ');
        if (formattedPostcode !== homePostcodeAsIs) {
          this.giftAidGroup.patchValue({
            homePostcode: formattedPostcode,
          });
        }
      }
    });

    // Gift Aid home address fields are validated only if the donor's claiming Gift Aid.
    this.giftAidGroup.get('giftAid')?.valueChanges.subscribe((giftAidChecked: boolean | null) => {
      this.setGiftAidValidatorsForChoice(!!giftAidChecked);
      this.updateAllValidities();

      if (giftAidChecked && this.tipValue === 0) {
        this.giftAidCheckedForZeroTip = true;
      }
    });

    if (this.creditPenceToUse > 0) {
      this.removeStripeCardBillingValidators();
    } else {
      this.addStripeCardBillingValidators();
    }

    this.updateAllValidities();
  }

  /**
   * There are many reasons that data is patched or validation rules dynamically changed,
   * and calling `updateValueAndValidity` "doesn't go *down* the tree, only up." So it
   * is safest to iterate over all individual fields calling this whenever the rules change.
   * This should mean that groups' and the whole form's validity statuses are also updated.
   *
   * Typically, we want to nudge validity changes but *don't* expect the value to have been
   * changed further to a patch that Angular already knows about. So emitting events is
   * redundant. More than this, it's highly likely to break things because some of the patches
   * are in listeners for changes – meaning that if we emit events, we'll end up in an infinite
   * loop.
   *
   * @link https://stackoverflow.com/a/54045398/2803757
   */
  private updateAllValidities() {
    for (const formGroup of [this.amountsGroup, this.giftAidGroup, this.paymentGroup]) {
      // Get each field in each group and update its validity.
      for (const control in formGroup.controls) {
        formGroup.get(control)!.updateValueAndValidity({ emitEvent: false }); // See fn doc re events.
      }
    }

    // Any time there were previous errors, we want to update them (including clearing them
    // if appropriate). This might happen e.g. if a donor started the form, then logged in.
    // We don't want any of this the first time the section is encountered as it's distracting
    // to see messages about missing fields before you first had a chance to fill them in.
    if (this.paymentStepErrors !== '') {
      if (this.readyToProgressFromPaymentStep) {
        this.paymentStepErrors = '';
      } else {
        this.paymentStepErrors = this.paymentReadinessTracker.getErrorsBlockingProgress().join(' ');
      }
    }
  }

  /**
   * @param giftAidChecked
   * @param homeOutsideUK Set if *just* changed, otherwise we'll use the last persisted value.
   */
  private setGiftAidValidatorsForChoice(giftAidChecked: boolean, homeOutsideUK?: boolean) {
    if (giftAidChecked) {
      this.giftAidGroup.controls.homePostcode!.setValidators(
        this.getHomePostcodeValidatorsWhenClaimingGiftAid(homeOutsideUK ?? this.giftAidGroup.value.homeOutsideUK),
      );
      this.giftAidGroup.controls.homeAddress!.setValidators([
        requiredNotBlankValidator,
        Validators.maxLength(255),
      ]);
    } else {
      this.giftAidGroup.controls.homePostcode!.setValidators([]);
      this.giftAidGroup.controls.homeAddress!.setValidators([]);
    }
  }

  private getHomePostcodeValidatorsWhenClaimingGiftAid(homeOutsideUK: boolean) {
    if (homeOutsideUK) {
      return [];
    }

    return [
      requiredNotBlankValidator,
      Validators.pattern(postcodeRegExp),
    ];
  }

  private removeStripeCardBillingValidators() {
    this.paymentGroup.controls.billingCountry!.setValidators([]);
    this.paymentGroup.controls.billingPostcode!.setValidators([]);
    this.paymentGroup.setErrors(null);
    this.donationForm.updateValueAndValidity();
  }

  private addStripeCardBillingValidators() {
    this.paymentGroup.controls.billingCountry!.setValidators([
      requiredNotBlankValidator,
    ]);
    this.paymentGroup.controls.billingPostcode!.setValidators([
      requiredNotBlankValidator,
      Validators.pattern(billingPostcodeRegExp),
    ]);
  }

  /**
   * @param percentage  e.g. from select field or a custom fee model campaign fee level.
   * @param donationAmount  Sanitised, e.g. via get() helper `donationAmount`.
   * @returns Tip or fee cover amount as a decimal string, as if input directly into a form field.
   */
  protected getTipOrFeeAmount(percentage: number, donationAmount?: number): string {
    if (this.creditPenceToUse > 0) {
      return '0'; // No tips on donation credit settlements.
    }

    return (percentage / 100 * (donationAmount || 0))
      .toFixed(2);
  }

  get readyToProgressFromPaymentStep(): boolean {
    return this.paymentReadinessTracker.readyToProgressFromPaymentStep;
  }

  private promptToContinue(
    title: string,
    status: string,
    statusDetail: string,
    cancelCopy: string,
    donation: Donation,
    surplusDonationInfo?: string,
  ) {
    const continueDialog = this.dialog.open(DonationStartMatchConfirmDialogComponent, {
      data: { cancelCopy, status, statusDetail, title, surplusDonationInfo },
      disableClose: true,
      role: 'alertdialog',
    });
    continueDialog.afterClosed().subscribe(this.getDialogResponseFn(donation));
  }

  /**
   * Thunk returning a fn which can handle a dialog true/false response and
   * continue/cancel `donation` accordingly.
   *
   * May be invoked:
   * (a) when loading the form having found a previous donation in
   *     browser state and confirmed with the API that it is resumable;
   * (b) after leaving step 1, having found that match funds will not cover
   *     the donation fully; or
   * (c) after match funds expire.
   */
  private getDialogResponseFn(donation: Donation) {
    return (proceed: boolean) => {
      if (proceed) {
        // Required for all use cases.
        this.donation = donation;
        this.donationChangeCallBack(donation);

        this.scheduleMatchingExpiryWarning(this.donation);

        // In doc block use case (a), we need to put the amounts from the previous
        // donation into the form and move to Step 2.
        const tipPercentageFixed = (100 * donation.tipAmount / donation.donationAmount).toFixed(1);
        let tipPercentage;

        if (['7.5', '10.0', '12.5', '15.0'].includes(tipPercentageFixed)) {
          tipPercentage = Number(tipPercentageFixed);
        } else {
          tipPercentage = 'Other';
        }

        const patchForValue = {
          donationAmount: donation.donationAmount.toString(),
          tipAmount: donation.tipAmount.toString(),
          tipPercentage,
        };

        this.amountsGroup.patchValue(patchForValue);
        // not sure why this is needed - the patchValue above seems like it should be enough. But that seems to not work,
        // see DON-909.
        this.amountsGroup.get('tipAmount')?.setValue(patchForValue.tipAmount);

        if (this.stepper.selected?.label === this.yourDonationStepLabel) {
          this.jumpToStep(donation.currencyCode === 'GBP' ? 'Gift Aid' : 'Payment details');
        }

        return;
      }

      // Else cancel the existing donation and remove our local record.
      this.donationService.cancel(donation)
        .subscribe({
          next: () => {
            this.matomoTracker.trackEvent('donate', 'cancel', `Donor cancelled donation ${donation.donationId} to campaign ${this.campaignId}`),

            // Also resets captcha.
            this.clearDonation(donation, {clearAllRecord: true, jumpToStart: true});

            // Go back to 1st step to encourage donor to try again
            this.stepper.reset();
            this.amountsGroup.patchValue({ tipPercentage: this.tipPercentage });
            this.tipPercentageChanged = false;
            if (this.paymentGroup) {
              this.paymentGroup.patchValue({
                billingCountry: this.defaultCountryCode,
              });
            }
            if (this.donor?.id) {
              const jwt = this.identityService.getJWT() as string;
              this.identityService.get(this.donor?.id, jwt).subscribe((person: Person) => {
                if (! this.donor?.id) {
                  throw new Error("Person identifier went away");
                }
                this.loadPerson(person, this.donor.id, jwt)
              });
            }
          },
          error: response => {
            this.matomoTracker.trackEvent(
              'donate_error',
              'cancel_failed',
              `Could not cancel donation ${donation.donationId} to campaign ${this.campaignId}: ${response.error.error}`,
            );
          },
        });
    };
  }

  private setChampionOptInValidity() {
    if (this.showChampionOptIn) {
      this.marketingGroup.controls.optInChampionEmail!.setValidators([
        requiredNotBlankValidator,
      ]);
    }
  }

  private async exitPostDonationSuccess(donation: Donation, stripe_donation_method: string|undefined) {

    const stripeMethod = stripe_donation_method || 'undefined';

    // if not card then we assume it must be a Payment Request Button i.e. Google Pay or Apple Pay.
    const action = stripe_donation_method === 'card' ?
        'stripe_card_payment_success' : 'stripe_prb_payment_success';

    this.matomoTracker.trackEvent(
      'donate',
      action,
      `Stripe Intent processing or done for donation ${donation.donationId} to campaign ${donation.projectId}, stripe method ${stripeMethod}`,
    );
    this.conversionTrackingService.convert(donation, this.campaign);

    this.cancelExpiryWarning();
    await this.router.navigate(['thanks', donation.donationId], {
      replaceUrl: true,
    });
  }

  private closeAncestorsHaveDisplayNone(el: HTMLElement): boolean {
    const levelsToCheck = 6; // Bug in `billiingPostcode` 30/11/22 had `display: none` 5 levels up from the input.
    let levelsUp = 0;
    let currentEl: HTMLElement | null = el;

    while (levelsUp <= levelsToCheck) {
      if (currentEl.style.display === 'none') {
        return true;
      }

      currentEl = currentEl.parentElement;

      if (!currentEl) {
        return false;
      }

      levelsUp++;
    }

    return false;
  }

  public loadPerson(person: Person, id: string, jwt: string) {
    this.donor = person; // Should mean donations are attached to the Stripe Customer.

    // Only tokens for Identity users with a password have enough access to load payment methods, use credit
    // balances and access personal data beyond the anonymous new Customer basics.
    if (this.identityService.isTokenForFinalisedUser(jwt)) {
      this.prepareDonationCredits(person);
      this.prefillRarelyChangingFormValuesFromPerson(person);

      // This is helpful when somebody logged in while on the page, to get the latest validation state
      // for them. For example, if they previously had many errors on the payment group but we patched
      // in their name etc., they may now have fewer.
      this.setConditionalValidators();
    }
  }

  continueFromPaymentStep() {
    if (! this.readyToProgressFromPaymentStep) {
      this.paymentStepErrors = this.paymentReadinessTracker.getErrorsBlockingProgress().join(" ");
      this.toast.showError(this.paymentStepErrors);
      return;
    } else {
      // Any errors still on the page at this point are from a previous attempt to pay. Clear them so they don't
      // show up again in case the next attempt has the same problem.
      this.paymentStepErrors = "";
      this.stripeError = undefined;
      this.next()
    }
  }

  private getPaymentMethodType() {
    return (this.creditPenceToUse > 0) ? 'customer_balance' : 'card';
  }

  protected showCardReuseMessage = false;
  protected summariseAddressSuggestion = AddressService.summariseAddressSuggestion;

  hideCaptcha() {
    this.shouldShowCaptcha = false;
  }

  showCaptcha() {
    this.shouldShowCaptcha = true;
  }
}
