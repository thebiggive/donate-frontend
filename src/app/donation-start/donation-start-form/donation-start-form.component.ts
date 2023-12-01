import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {DatePipe, getCurrencySymbol, isPlatformBrowser} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {
  AfterContentChecked,
  AfterContentInit,
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
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from '@angular/router';
import {RecaptchaComponent} from 'ng-recaptcha';
import {MatomoTracker} from 'ngx-matomo';
import {debounceTime, distinctUntilChanged, retryWhen, startWith, switchMap, tap} from 'rxjs/operators';
import {
  PaymentIntent,
  PaymentMethod,
  StripeElementChangeEvent,
  StripeElements,
  StripeError,
  StripePaymentElement,
} from '@stripe/stripe-js';
import {EMPTY, firstValueFrom} from 'rxjs';

import {Campaign} from '../../campaign.model';
import {CardIconsService} from '../../card-icons.service';
import {campaignHiddenMessage} from '../../../environments/common';
import {COUNTRIES} from '../../countries';
import {Donation, maximumDonationAmount} from '../../donation.model';
import {DonationCreatedResponse} from '../../donation-created-response.model';
import {DonationService} from '../../donation.service';
import {DonationStartMatchConfirmDialogComponent} from '../donation-start-match-confirm-dialog.component';
import {DonationStartMatchingExpiredDialogComponent} from '../donation-start-matching-expired-dialog.component';
import {DonationStartOfferReuseDialogComponent} from '../donation-start-offer-reuse-dialog.component';
import {environment} from '../../../environments/environment';
import {ExactCurrencyPipe} from '../../exact-currency.pipe';
import {GiftAidAddress} from '../../gift-aid-address.model';
import {GiftAidAddressSuggestion} from '../../gift-aid-address-suggestion.model';
import {IdentityService} from '../../identity.service';
import {ConversionTrackingService} from '../../conversionTracking.service';
import {PageMetaService} from '../../page-meta.service';
import {Person} from '../../person.model';
import {PostcodeService} from '../../postcode.service';
import {retryStrategy} from '../../observable-retry';
import {StripeService} from '../../stripe.service';
import {getCurrencyMaxValidator} from '../../validators/currency-max';
import {getCurrencyMinValidator} from '../../validators/currency-min';
import {EMAIL_REGEXP} from '../../validators/patterns';
import {ValidateBillingPostCode} from '../../validators/validate-billing-post-code';
import {TimeLeftPipe} from "../../time-left.pipe";
import {updateDonationFromForm} from "../updateDonationFromForm";
import {sanitiseCurrency} from "../sanitiseCurrency";
import {DonationTippingSliderComponent} from "./donation-tipping-slider/donation-tipping-slider.component";
import {PaymentReadinessTracker} from "./PaymentReadinessTracker";

declare var _paq: {
  push: (args: Array<string|object>) => void,
};

@Component({
  selector: 'app-donation-start-form',
  templateUrl: './donation-start-form.component.html',
  styleUrls: ['./donation-start-form.component.scss'],
  providers: [
    TimeLeftPipe,
  ]
})
export class DonationStartFormComponent implements AfterContentChecked, AfterContentInit, OnDestroy, OnInit {
  @ViewChild('idCaptcha') idCaptcha: RecaptchaComponent;
  @ViewChild('cardInfo') cardInfo: ElementRef;
  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild('donationTippingSlider') private donationTippingSlider: DonationTippingSliderComponent|undefined;

  alternateCopy = false; // Varies tip copy for A/B test.

  stripePaymentElement: StripePaymentElement | undefined;
  cardHandler = this.onStripeCardChange.bind(this);
  showChampionOptIn = false;

  @Input({ required: true }) campaign: Campaign;

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

  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;

  creditPenceToUse = 0; // Set non-zero if logged in and Customer has a credit balance to spend. Caps donation amount too in that case.
  currencySymbol: string;

  donationForm: FormGroup;
  amountsGroup: FormGroup;
  giftAidGroup: FormGroup;
  paymentGroup: FormGroup;
  marketingGroup: FormGroup;

  maximumDonationAmount: number;
  maximumTipPercentage = 30 as const;

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
  psp: 'stripe';
  retrying = false;
  addressSuggestions: GiftAidAddressSuggestion[] = [];
  donationCreateError = false;
  donationUpdateError = false;
  /** setTimeout reference (timer ID) if applicable. */
  expiryWarning?: ReturnType<typeof setTimeout>; // https://stackoverflow.com/a/56239226
  loadingAddressSuggestions = false;
  privacyUrl = 'https://biggive.org/privacy';
  showAddressLookup: boolean;

  // Kind of a subset of `stripePaymentMethodReady`, which tracks just the Payment Element Stripe.js element based
  // on the `complete` property of the callback event. Doesn't cover saved cards, or donation credit.
  // Maintains its value and is NOT reset when settlement method changes to one of those, since it might
  // change back.
  stripeManualCardInputValid = false;

  stripePaymentMethodReady = false;
  stripeError?: string;
  stripeSavedMethods: PaymentMethod[] = [];
  selectedSavedMethod: PaymentMethod | undefined;
  submitting = false;
  termsUrl = 'https://biggive.org/terms-and-conditions';
  // Track 'Next' clicks so we know when to show missing radio button error messages.
  triedToLeaveGiftAid = false;
  triedToLeaveMarketing = false;
  showAllPaymentMethods: boolean = false;

  protected campaignId: string;

  /**
   * Tracks internally whether (Person +) Donation setup is in flight. This is important to prevent duplicates, because multiple
   * time-variable triggers including user-initiated stepper step changes and async, invisible reCAPTCHA returns can cause us
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
  /**
   * Used just to take raw input and put together an all-caps, spaced UK postcode, assuming the
   * input was valid (even if differently formatted). Loosely based on https://stackoverflow.com/a/10701634/2803757
   * with an additional tweak to allow (and trim) surrounding spaces.
   */
  private postcodeFormatHelpRegExp = new RegExp('^\\s*([A-Z]{1,2}\\d{1,2}[A-Z]?)\\s*(\\d[A-Z]{2})\\s*$');
  // Based on the simplified pattern suggestions in https://stackoverflow.com/a/51885364/2803757
  private postcodeRegExp = new RegExp('^([A-Z][A-HJ-Y]?\\d[A-Z\\d]? \\d[A-Z]{2}|GIR 0A{2})$');

  // Intentionally looser to support most countries' formats.
  private billingPostcodeRegExp = new RegExp('^[0-9a-zA-Z -]{2,8}$');

  private idCaptchaCode?: string;
  private stripeResponseErrorCode?: string; // stores error codes returned by Stripe after callout
  private stepChangeBlockedByCaptcha = false;
  @Input({ required: true }) donor: Person | undefined;

  /**
   * Keys are ISO2 codes, values are names.
   */
  public countryOptionsObject: Array<{label: string, value: string}>;
  public tipControlStyle: 'dropdown'|'slider';

  private tipAmountFromSlider: number;

  panelOpenState = false;
  showCustomTipInput = false;
  // will be undefined if the drop-down is in use instead of the slider.
  @ViewChild('donationTippingSlider') tippingSlider: DonationTippingSliderComponent | undefined;

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

    this.tippingSlider?.setTipAmount(this.tipValue);

    this.amountsGroup.get('tipAmount')?.setValue(tipValueRounded);
    this.showCustomTipInput = false;
  }

  private stripeElements: StripeElements | undefined;
  private selectedPaymentMethodType: string | undefined;
  private paymentReadinessTracker: PaymentReadinessTracker;
  public paymentStepErrors: string = "";

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
    private postcodeService: PostcodeService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private stripeService: StripeService,
    public datePipe: DatePipe,
    public timeLeftPipe: TimeLeftPipe,
    private snackBar: MatSnackBar,
  ) {
    this.defaultCountryCode = this.donationService.getDefaultCounty();
    this.countryOptionsObject = COUNTRIES.map(country => ({label: country.country, value: country.iso2}))
    this.selectedCountryCode = this.defaultCountryCode;

    this.tipControlStyle = (route.snapshot.queryParams?.tipControl?.toLowerCase() === 'slider')
      ? 'slider' : 'dropdown'
  }

  ngOnDestroy() {
    if (this.donation) {
      this.clearDonation(this.donation, false);
    }

    this.destroyStripeElements();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.stripeService.init();

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
                activate: (_event: any) => {
                  // No change from the original form.
                  console.log('Original test variant active!');
                }
            },
            {
                name: environment.matomoAbTest.variantName,
                activate: (_event: any) => {
                  this.alternateCopy = true;
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

    const formGroups: {
      amounts: FormGroup,   // Matching reservation happens at the end of this group.
      giftAid: FormGroup,
      marketing: FormGroup,
      payment: FormGroup,  // Always present now we're Stripe-only.
    } = {
      amounts: this.formBuilder.group({
        donationAmount: [null, [
          Validators.required,
          getCurrencyMinValidator(1), // min donation is £1
          getCurrencyMaxValidator(),
          Validators.pattern('^[£$]?[0-9]+?(\\.00)?$'),
        ]],
        coverFee: [false],
        feeCoverAmount: [null],
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
        optInCharityEmail: [null, Validators.required],
        optInTbgEmail: [null, Validators.required],
        optInChampionEmail: [null],
      }),
      payment: this.formBuilder.group({
        firstName: [null, [
          Validators.maxLength(40),
          Validators.required,
        ]],
        lastName: [null, [
          Validators.maxLength(80),
          Validators.required,
        ]],
        emailAddress: [null, [
          Validators.required,
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
    });

    this.maximumDonationAmount = maximumDonationAmount(this.campaign.currencyCode, this.creditPenceToUse);

    if (isPlatformBrowser(this.platformId)) {
      this.handleCampaignViewUpdates();
    }

    this.paymentReadinessTracker = new PaymentReadinessTracker(this.paymentGroup)
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

            if (this.donation) {
              this.clearDonation(this.donation, true);
            }
            this.createDonationAndMaybePerson();
          });
          return;
        }

        this.offerExistingDonation(existingDonation);
    });
  }

  ngAfterContentInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.showAddressLookup =
      this.psp === 'stripe' &&
      !! environment.postcodeLookupKey &&
      !! environment.postcodeLookupUri;

    if (!this.showAddressLookup) {
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

    this.amountsGroup?.patchValue({tipAmount: this.tipAmountFromSlider});
    this.tipAmountField?.setValue(this.tipAmountFromSlider);
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
        // Disallow any step jumps by header click without a valid captcha, since the donor could have
        // dismissed the puzzle (including by accident) and they'll face errors later, which are more annoying,
        // without a working code. If they click step 1 while on step 1 this might fire the captcha slightly
        // earlier than normal, but that should be mostly harmless – at worst if they take that unusual
        // step they might have to solve 2 puzzles.

        // For now, I've gone with only checking this on header click because the other way of changing step
        // is, as far as we know, working. And we want to minimise the change during CC23. A better solution
        // later might be to remove all the captcha executes that happen specifically on button clicks (`next()`)
        // and to execute it in `stepChanged()` – except when just booted back to step 0 – instead.
        if (!this.idCaptchaCode) {
          clickEvent.preventDefault();

          try {
            this.idCaptcha.reset();
          } catch (e) {
            this.matomoTracker.trackEvent('identity_error', 'step_change_captcha_reset_failed', e.message);
            this.reset(); // Includes page refresh atm – annoying but less so than filling out even more broken fields.
            return;
          }

          this.idCaptcha.execute();
          return;
        }

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
    this.paymentReadinessTracker = new PaymentReadinessTracker(this.paymentGroup,);
    this.donationForm.reset();
    this.identityService.clearJWT();
    this.destroyStripeElements();

    // We should probably reinstate `this.idCaptcha.reset();` here iff we replace the full
    // location.reload(). For as long as we are unloading the whole doc, there should be
    // no need to reset the ViewChild.

    location.reload();
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

  async stepChanged(event: StepperSelectionEvent) {
    if (event.selectedStep.label === 'Payment details' && !this.idCaptchaCode) {
      this.showErrorToast('Sorry, you need to complete the "captcha" puzzle first – this is a fraud control to help protect our donors');
      this.jumpToStep(event.previouslySelectedStep.label);
      this.idCaptcha.execute();
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
            this.clearDonation(this.donation, true);
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
      // Else it's not a step that cleanly maps to the historically-comparable
      // e-commerce funnel steps defined in our Analytics campaign, besides 1
      // (which we fire on donation create API callback) and 4 (which we fire
      // alongside calling payWithStripe()).
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
        this.createDonationAndMaybePerson();
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
  }

  /**
   * According to stripe docs https://stripe.com/docs/js/element/events/on_change?type=paymentElement the change event has
   * a value key as expected here. I'm not sure why that isn't included in the TS StripeElementChangeEvent interface.
   */
  async onStripeCardChange(state: StripeElementChangeEvent & ({value: {type: string} | undefined})) {
    this.addStripeCardBillingValidators();

    // Re-evaluate stripe card billing validators after being set above.
    // This should remove old errors after card details change, e.g. it
    // should remove an invalid post-code error in such a scenario.
    this.paymentGroup.controls.billingPostcode!.updateValueAndValidity();

    this.stripeManualCardInputValid = this.stripePaymentMethodReady = state.complete;
    this.paymentReadinessTracker.onStripeCardChange(state);

    if (state.error) {
      this.stripeError = this.getStripeFriendlyError(state.error, 'card_change');
      this.stripeResponseErrorCode = state.error.code;
    } else {
      this.stripeError = undefined; // Clear any previous card errors if number fixed.
      this.stripeResponseErrorCode = undefined;
    }

    // Jump back if we get an out of band message back that the card is *not* valid/ready.
    // Don't jump forward when the card *is* valid, as the donor might have been
    // intending to edit something else in the `payment` step; let them click Next.
    if (!this.donation || !this.stripePaymentMethodReady || !this.stripePaymentElement || !this.stripeElements) {
      this.jumpToStep('Payment details');

      return;
    }

    if (state.value) {
      this.selectedPaymentMethodType = state.value.type;
    }
  }

  async submit() {
    if (!this.donation || this.donationForm.invalid) {
      let errorCodeDetail = '[code B1]'; // Form invalid.
      if (!this.donation) {
        errorCodeDetail = '[code A1]'; // Donation property absent.
      }

      const errorMessage = `Missing donation information – please refresh and try again, or email hello@biggive.org quoting ${errorCodeDetail} if this problem persists`;

      this.showErrorToast(errorMessage);

      this.stripeError = errorMessage;

      this.stripeResponseErrorCode = undefined;
      this.matomoTracker.trackEvent(
        'donate_error',
        'submit_missing_donation_basics',
        `Donation not set or form invalid ${errorCodeDetail}`,
      );
      return;
    }

    if (
      this.paymentGroup.value.billingPostcode
    ) {
      this.donation.billingPostalAddress = this.paymentGroup.value.billingPostcode;
      this.donation.countryCode = this.paymentGroup.value.billingCountry;
      this.donationService.updateLocalDonation(this.donation);
    }

    this.submitting = true;
    this.donationUpdateError = false;

    // Can't proceed if campaign info not looked up yet or no usable PSP
    if (!this.donation || !this.campaign || !this.campaign.charity.id || !this.psp) {
      this.donationUpdateError = true;
      this.showErrorToast("Sorry, we can't submit your donation right now.");
      return;
    }

    this.donationService.update(this.donation)
      // excluding status code, delay for logging clarity
      .pipe(
        retryWhen(updateError => {
          return updateError.pipe(
            tap(val => this.retrying = (val.status !== 500)),
            retryStrategy({excludedStatusCodes: [500]}),
          );
        }),
      )
      .subscribe(async (donation: Donation) => {
        if (donation.psp === 'stripe') {
          this.payWithStripe();
        }
      }, response => {
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
        this.showErrorToast("Sorry, we can't submit your donation right now.");
        this.submitting = false;
      });
  }

  async payWithStripe() {
    const hasCredit = this.creditPenceToUse > 0;

    const methodIsReady = this.stripePaymentElement || this.selectedSavedMethod || hasCredit;

    if (!this.donation || !methodIsReady) {
      this.stripeError = 'Missing data from previous step – please refresh and try again';
      this.stripeResponseErrorCode = undefined;
      this.matomoTracker.trackEvent('donate_error', 'stripe_pay_missing_secret', `Donation ID: ${this.donation?.donationId}`);
      return;
    }

    if (hasCredit) {
      // Settlement is via the Customer's cash balance, with no client-side provision of a Payment Method.
      this.donationService.finaliseCashBalancePurchase(this.donation).subscribe({
        next: (donation) => {
          this.matomoTracker.trackEvent(
            'donate',
            'stripe_customer_balance_payment_success',
            `Stripe Intent expected to auto-confirm for donation ${donation.donationId} to campaign ${donation.projectId}`,
          );
          this.exitPostDonationSuccess(donation, 'donation-funds');
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

    if (!this.stripeElements && !this.selectedSavedMethod) {
      throw new Error("Missing stripe elements");
    }

    let paymentMethodResult;
    let paymentMethod;
    if (this.selectedSavedMethod) {
      paymentMethod = this.selectedSavedMethod;
    } else {
      paymentMethodResult = await this.stripeService.prepareMethodFromPaymentElement(this.donation, <StripeElements>this.stripeElements);
      paymentMethod = paymentMethodResult.paymentMethod;
    }

    if (paymentMethod) {
      try {
        result = await firstValueFrom(this.donationService.confirmCardPayment(this.donation, paymentMethod));
      } catch (httpError) {
        this.matomoTracker.trackEvent(
          'donate_error',
          'stripe_confirm_failed',
          httpError.error?.error?.code,
        );

        this.handleStripeError(httpError.error?.error, 'confirm');

        return;
      }

      if (result?.paymentIntent && result.paymentIntent.status === 'requires_action') {
        if (!result.paymentIntent.client_secret) {
          throw new Error("payment intent requires action but client secret missing")
        }
        const {
          error,
        } = await this.stripeService.handleNextAction(result.paymentIntent!.client_secret);
        if (!error) {
          this.exitPostDonationSuccess(this.donation, this.selectedPaymentMethodType);
          return;
        } else {
          // Next action (e.g. 3D Secure) was run by Stripe.js, and failed.
          result = {error: error};
          this.submitting = false;
        }
      } // Else there's a `paymentMethod` which is already successful or errored » both handled later.
    } else {
      result = {error: paymentMethodResult?.error};
    }

    if (!result || result.error) {
      // Client-side issue that wasn't a next_action should be a `prepareMethodFromPaymentElement()`
      // problem.
      if (result) {
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
      this.exitPostDonationSuccess(this.donation, this.selectedPaymentMethodType);
      return;
    }

    // else Intent 'done' but not a successful status.
    this.matomoTracker.trackEvent('donate_error', 'stripe_intent_not_success', result.paymentIntent.status);
    this.stripeError = `Status: ${result.paymentIntent.status}`;
    this.stripeResponseErrorCode = undefined;
    this.submitting = false;
  }

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
   * Quick getter for donation amount, to keep template use concise.
   */
  get donationAmount(): number {
    return sanitiseCurrency(this.amountsGroup.value.donationAmount?.trim());
  }

  /**
   * Donation plus any tip and/or fee cover.
   */
  get donationAndExtrasAmount(): number {
    return this.donationAmount + this.tipAmount() + this.feeCoverAmount();
  }

  captchaIdentityError() {
    // Not passing event as it will "most often (if not always) be empty". https://github.com/DethAriel/ng-recaptcha#events
    this.matomoTracker.trackEvent('identity_error', 'person_captcha_failed', 'reCAPTCHA hit errored() callback');
    this.creatingDonation = false;
    this.donationCreateError = true;
    this.showDonationCreateError();
    this.stepper.previous(); // Go back to step 1 to make the general error for donor visible.
  }

  /**
   * Called when ever we set this.donationCreateError = true. For now its all one error message but we may want to
   * replace some of the calls with a different more specific message that identifies the cause of the problem if it will
   * either help donors directly or if they might usefully quote it to us in a support case.
   */
  showDonationCreateError() {
    this.showErrorToast(
        "Sorry, we can't register your donation right now. Please try again in a moment or contact " +
        " us if this message persists."
    )
  }

  captchaIdentityReturn(captchaResponse: string) {
    if (captchaResponse === null) {
      // Ensure no other callback tries to use the old captcha code, and will re-execute
      // the catcha to get a new one as needed instead.
      this.idCaptchaCode = undefined;
      return;
    }

    if (this.stepChangeBlockedByCaptcha) {
      this.stepper.next();
      this.stepChangeBlockedByCaptcha = false;
    }

    this.idCaptchaCode = captchaResponse;
    if (!this.donation) {
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

  feeCoverAmount(): number {
    return sanitiseCurrency(this.amountsGroup.value.feeCoverAmount);
  }

  giftAidAmount(): number {
    return this.giftAidGroup.value.giftAid ? (0.25 * this.donationAmount) : 0;
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

  scrollTo(el: Element): void {
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
        this.clearDonation(this.donation, true);
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
    this.stripePaymentMethodReady = !!this.selectedSavedMethod || this.stripeManualCardInputValid || this.creditPenceToUse > 0;

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

  progressFromStepOne() {

    const control = this.donationForm.controls['amounts'];
    if(! control!.valid) {
      this.showErrorToast(this.displayableAmountsStepErrors() || 'Sorry, there was an error with the donation amount or tip amount');

      return;
    }

    this.next();
  }

  /**
   * Displays a message on screen to let a donor know why they can't progress from the current step. Message should be
   * an explanation, e.g. because they need to fill in a certain field or what they have entered isn't usable.
   */
  private showErrorToast(message: string) {
    this.snackBar.open(
      message,
      undefined,
      {
        // formula for duration from https://ux.stackexchange.com/a/85898/7211
        duration: Math.min(Math.max(message.length * 50, 2_000), 7_000),
        panelClass: 'snack-bar',
      }
    );
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
      this.showErrorToast(errorMessages.join(". "));
      return;
    }

    this.next()
  }

  progressFromStepReceiveUpdates(): void {
    this.triedToLeaveMarketing = true;
    const errorMessages = Object.values(this.errorMessagesForMarketingStep()).filter(Boolean)
    if (errorMessages.length > 0) {
      this.showErrorToast(errorMessages.join(" "));
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

    onUseSavedCardChange(event: MatCheckboxChange, paymentMethod: PaymentMethod) {
    // For now, we assume unticking happens before card entry, so we can just set the validity flag to false.
    // Ideally, we would later track `card`'s validity separately so that going back up the page, ticking this
    // then unticking it leaves the card box valid without having to modify it. But this is rare and
    // work-around-able, so for now it's not worth the refactoring time.
    const checked = event.checked;
    this.stripePaymentMethodReady = checked || this.stripeManualCardInputValid;
    this.paymentReadinessTracker.onUseSavedCardChange(checked);

    if (checked) {
      this.selectedSavedMethod = paymentMethod;
      this.updateFormWithBillingDetails(this.selectedSavedMethod);
      this.paymentReadinessTracker.selectedSavedPaymentMethod();
    } else {
      this.selectedSavedMethod = undefined;
      this.prepareStripeElements();
    }
  }

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

      // Reset Stripe validators so the ValidateBillingPostCode custom validator
      // is removed, so billing postcode doesn't show as invalid after a change
      this.addStripeCardBillingValidators();
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
      this.stripeElements = this.stripeService.stripeElements(this.donation, this.campaign);
    }

    if (this.stripePaymentElement) {
      // Payment element was already ready & we presume mounted.
      return;
    }

    this.stripePaymentElement = this.stripeElements.create(
        "payment",
        {
          wallets: {
            applePay: 'auto',
            googlePay: 'auto'
          },
          terms: {
            // We have our own terms copy for the future payment in donation-start-form.component.html
            card: "never",
            applePay: "never",
            googlePay: "never",
          },
          fields: {
            billingDetails: {
              address: {
                // We have our own input fields for country and postal code - we will pass these to stripe on payment confirmation.
                country: "never",
                postalCode: "never",
              }
            },
          },
          business: {name: "Big Give"},
        }
    );

    if (this.cardInfo && this.stripePaymentElement) {
      this.stripePaymentElement.mount(this.cardInfo.nativeElement);
      this.stripePaymentElement.on('change', this.cardHandler);
    }
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

      if (this.donation) {
        this.donation.pspMethodType = this.getPaymentMethodType();
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

  private loadFirstSavedStripeCardIfAny(id: string, jwt: string) {
    this.donationService.getPaymentMethods(id, jwt).subscribe((response: { data: PaymentMethod[] }) => {
      if (response.data.length > 0) {
        this.stripePaymentMethodReady = true;
        this.stripeSavedMethods = response.data;

        // not null assertion is justified because we know the data length is > 0. Seems TS isn't smart enough to
        // notice that.
        const firstPaymentMethod = response.data[0]!;
        this.selectedSavedMethod = firstPaymentMethod;
        this.paymentReadinessTracker.selectedSavedPaymentMethod();
        this.updateFormWithBillingDetails(firstPaymentMethod);
      }
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
    error: StripeError | {message: string, code: string, decline_code?: string},
    context: string,
  ) {
    this.submitting = false;
    this.stripeError = this.getStripeFriendlyError(error, context);
    this.stripeResponseErrorCode = error.code;
    if (this.isBillingPostcodePossiblyInvalid()) {
      this.paymentGroup.controls.billingPostcode!.setValidators([
        Validators.required,
        Validators.pattern(this.billingPostcodeRegExp),
        ValidateBillingPostCode
      ]);
      this.paymentGroup.controls.billingPostcode!.updateValueAndValidity();
    }

    this.jumpToStep('Payment details');
    this.goToFirstVisibleError();
  }

  /**
   * @param error
   * @param context 'method_setup', 'card_change' or 'confirm'.
   */
  private getStripeFriendlyError(
    error: StripeError | {message: string, code: string, decline_code?: string},
    context: string,
  ): string {
    let prefix = '';
    switch (context) {
      case 'method_setup':
        prefix = 'Payment setup failed: ';
        break;
      case 'card_change':
        prefix = 'Payment method update failed: ';
        break;
      case 'confirm':
        prefix = 'Payment processing failed: ';
    }

    let friendlyError = error.message;

    let customMessage = false;
    if (error.code === 'card_declined' && error.decline_code === 'generic_decline') {
      // Probably a custom Radar rule -> relatively likely to be an incorrect postcode.
      friendlyError = `The payment was declined. Please ensure details provided (including postcode) match your card. Contact your bank or hello@biggive.org if the problem persists.`;
      customMessage = true;
    }

    if (error.code === 'card_declined' && error.decline_code === 'invalid_amount') {
      // We've seen e.g. HSBC in Nov '23 decline large donations with this code.
      friendlyError = 'The payment was declined. You might need to contact your bank before making a donation of this amount.';
      customMessage = true;
    }

    if (customMessage && context === 'confirm') {
      prefix = ''; // Don't show extra context info in the most common `context`, when showing our already-long custom copy.
    }

    return `${prefix}${friendlyError}`;
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
      return true;
    }

    const firstCustomError = stepJustDone.querySelector('.error');
    if (firstCustomError) {
      this.scrollTo(firstCustomError);
      return true;
    }

    return false;
  }

  private setCampaignBasedVars() {
    this.campaignId = this.campaign.id;

    // We want to let donors finish the journey if they're on the page before the campaign
    // close date and it passes while they're completing the form – in particular they should
    // be able to use match funds secured until 30 minutes after the close time.

    this.currencySymbol = getCurrencySymbol(this.campaign.currencyCode, 'narrow', 'en-GB');

    if (environment.psps.stripe.enabled && this.campaign.charity.stripeAccountId) {
      this.psp = 'stripe';
    } else {
      this.noPsps = true;
    }

    if (this.campaign.championOptInStatement) {
      this.showChampionOptIn = true;
    }

    if (this.campaign.hidden) {
      this.showErrorToast(campaignHiddenMessage);
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
    if (this.creatingDonation) { // Ensure only 1 trigger is doing this at a time.
      return;
    }

    if (! this.idCaptchaCode) {
      // we don't have a captcha code yet, not ready to create the donation.
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
      feeCoverAmount: sanitiseCurrency(this.amountsGroup.value.feeCoverAmount),
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
      const person: Person = {};
      person.captcha_code = this.idCaptchaCode;
      this.identityService.create(person).subscribe(
        (person: Person) => {
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

    try {
      this.idCaptcha.reset();
    } catch (e) {
      // The donor may be having connection problems, and we've seen reCAPTCHA behave weirdly if the
      // @ViewChild doesn't have a working, mounted element here. To avoid wasting donors' time and
      // failing later, track so we can measure frequency and attempt a full reset – which currently
      // includes a page reload.
      this.matomoTracker.trackEvent('identity_error', 'person_captcha_reset_failed', e.message);
      this.reset();
      return true; // Make sure callers treat this as "not ready", while we finish reloading.
    }

    this.idCaptcha.execute(); // Prepare for a Person create which needs an Identity captcha.

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

  private newDonationError(response: any) {
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

    this.donationService.saveDonation(response.donation, response.jwt);
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
   */
  private clearDonation(donation: Donation, clearAllRecord: boolean) {
    if (clearAllRecord) { // i.e. don't keep donation around for /thanks/... or reuse.
      this.donationService.removeLocalDonation(donation);
    }

    this.cancelExpiryWarning();

    // Ensure we get a new code on donation setup if person ID somehow gets cleared. Sending a code we
    // already verified again will fail and block creating a new person without a page refresh.
    this.idCaptchaCode = undefined;
    try {
      this.idCaptcha.reset();
    } catch (e) {
      this.matomoTracker.trackEvent('identity_error', 'person_captcha_reset_failed_during_clear', e.message);
      this.reset();
      return;
    }

    this.creatingDonation = false;
    this.donationCreateError = false;
    this.donationUpdateError = false;

    if (this.stripeSavedMethods.length < 1) {
      this.selectedSavedMethod = undefined;
      this.paymentReadinessTracker.clearSavedPaymentMethod();
    }
    this.retrying = false;
    this.submitting = false;

    delete this.donation;
    this.donationChangeCallBack(undefined)

    // If we are clearing the donation, then any attempts to submit() if donor is further down the
    // form are doomed to fail.
    this.jumpToStep(this.yourDonationStepLabel);
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
    this.giftAidGroup.controls.giftAid!.setValidators([Validators.required]);
    this.giftAidGroup.updateValueAndValidity();
  }

  public updateTipAmountFromSelectedPercentage = (tipPercentage: string) => {
    if (tipPercentage === 'Other') {
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
    if (this.campaign.feePercentage) {
      // On the alternative fee model, we need to listen for coverFee
      // checkbox changes and don't have a tip percentage dropdown.
      this.amountsGroup.get('coverFee')?.valueChanges.subscribe(coverFee => {
        let feeCoverAmount = '0.00';
        // % should always be non-null when checkbox available, but re-assert
        // that here to keep type checks happy.
        if (coverFee && this.campaign.feePercentage) {
          // Keep value consistent with format of manual string inputs.
          feeCoverAmount = this.getTipOrFeeAmount(this.campaign.feePercentage, this.donationAmount);
        }

        this.amountsGroup.patchValue({ feeCoverAmount });
      });

      this.amountsGroup.get('donationAmount')?.valueChanges.subscribe(donationAmount => {
        if (!this.campaign.feePercentage) {
          return;
        }

        const feeCoverAmount = this.amountsGroup.get('coverFee')?.value
          ? this.getTipOrFeeAmount(this.campaign.feePercentage, sanitiseCurrency(donationAmount))
          : '0.00';

        this.amountsGroup.patchValue({ feeCoverAmount });
      });
    } else {
      // On the default fee model, we need to listen for tip percentage
      // field changes and don't have a cover fee checkbox. We don't ask for a
      // tip on donation when using a donor's credit balance.
      if (this.creditPenceToUse === 0) {
        this.amountsGroup.controls.tipAmount!.setValidators([
          Validators.required,
          // We allow spaces at start and end of amount inputs because people can easily paste them in
          // by mistake, and they don't do any harm. Maxlength in the HTML makes sure there can't be so much as
          // to stop the number being visible.
          Validators.pattern('^\\s*[£$]?[0-9]+?(\\.[0-9]{1,2})?\\s*$'),
          getCurrencyMaxValidator(),
        ]);
      }

      // Reduce the maximum to the credit balance if using donor credit and it's below the global max.
      this.amountsGroup.controls.donationAmount!.setValidators([
        Validators.required,
        getCurrencyMinValidator(1), // min donation is £1
        getCurrencyMaxValidator(maximumDonationAmount(this.campaign.currencyCode, this.creditPenceToUse)),
        Validators.pattern('^\\s*[£$]?[0-9]+?(\\.00)?\\s*$'),
      ]);

      this.amountsGroup.get('donationAmount')?.valueChanges.subscribe(donationAmount => {
        const updatedValues: {
          tipPercentage?: number | string,
          tipAmount?: string
        } = {};

        donationAmount = sanitiseCurrency(donationAmount);

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
    }

    this.giftAidGroup.get('homeOutsideUK')?.valueChanges.subscribe(homeOutsideUK => {
      this.giftAidGroup.controls.homePostcode!.setValidators(
        this.getHomePostcodeValidatorsWhenClaimingGiftAid(homeOutsideUK),
      );
      this.giftAidGroup.controls.homePostcode!.updateValueAndValidity();
    });

    this.giftAidGroup.get('homePostcode')?.valueChanges.subscribe(homePostcode => {
      if (homePostcode !== null) {
        const homePostcodeAsIs = homePostcode;

        // Uppercase it in-place, then we can use patterns that assume upper case.
        homePostcode = homePostcode.toUpperCase();
        var parts = homePostcode.match(this.postcodeFormatHelpRegExp);
        if (parts === null) {
          // If the input doesn't even match the much looser pattern here, it's going to fail
          // the validator check in a moment and there's nothing we can/should do with it
          // formatting-wise.
          return;
        }
        parts.shift();
        let formattedPostcode = parts.join(' ');
        if (formattedPostcode !== homePostcodeAsIs) {
          this.giftAidGroup.patchValue({
            homePostcode: formattedPostcode,
          });
        }
      }
    });

    // Gift Aid home address fields are validated only if the donor's claiming Gift Aid.
    this.giftAidGroup.get('giftAid')?.valueChanges.subscribe(giftAidChecked => {
      if (giftAidChecked) {
        this.giftAidGroup.controls.homePostcode!.setValidators(
          this.getHomePostcodeValidatorsWhenClaimingGiftAid(this.giftAidGroup.value.homeOutsideUK),
        );
        this.giftAidGroup.controls.homeAddress!.setValidators([
          Validators.required,
          Validators.maxLength(255),
        ]);
      } else {
        this.giftAidGroup.controls.homePostcode!.setValidators([]);
        this.giftAidGroup.controls.homeAddress!.setValidators([]);
      }

      this.giftAidGroup.controls.homePostcode!.updateValueAndValidity();
      this.giftAidGroup.controls.homeAddress!.updateValueAndValidity();
    });

    if (this.creditPenceToUse > 0) {
      this.removeStripeCardBillingValidators();
    } else {
      this.addStripeCardBillingValidators();
    }
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

  private removeStripeCardBillingValidators() {
    this.paymentGroup.controls.billingCountry!.setValidators([]);
    this.paymentGroup.controls.billingPostcode!.setValidators([]);
    this.paymentGroup.controls.billingCountry!.updateValueAndValidity();
    this.paymentGroup.controls.billingPostcode!.updateValueAndValidity();
  }

  private addStripeCardBillingValidators() {
    this.paymentGroup.controls.billingCountry!.setValidators([
      Validators.required,
    ]);
    this.paymentGroup.controls.billingPostcode!.setValidators([
      Validators.required,
      Validators.pattern(this.billingPostcodeRegExp),
    ]);
    this.paymentGroup.controls.billingCountry!.updateValueAndValidity();
    this.paymentGroup.controls.billingPostcode!.updateValueAndValidity();
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

  get captchaIsSolved(): boolean {
    return this.idCaptchaCode !== undefined;
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
        .subscribe(
          () => {
            this.matomoTracker.trackEvent('donate', 'cancel', `Donor cancelled donation ${donation.donationId} to campaign ${this.campaignId}`),

            // Also resets captcha.
            this.clearDonation(donation, true);

            // Go back to 1st step to encourage donor to try again
            this.stepper.reset();
            this.amountsGroup.patchValue({ tipPercentage: this.tipPercentage });
            this.tipPercentageChanged = false;
            if (this.paymentGroup) {
              this.paymentGroup.patchValue({
                billingCountry: this.defaultCountryCode,
              });
            }
            this.selectedSavedMethod = this.stripeSavedMethods.length > 0 ? this.stripeSavedMethods[0] : undefined;
            if (this.selectedSavedMethod) {
              this.paymentReadinessTracker.selectedSavedPaymentMethod();
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
          response => {
            this.matomoTracker.trackEvent(
              'donate_error',
              'cancel_failed',
              `Could not cancel donation ${donation.donationId} to campaign ${this.campaignId}: ${response.error.error}`,
            );
          },
        );
    };
  }

  private setChampionOptInValidity() {
    if (this.showChampionOptIn) {
      this.marketingGroup.controls.optInChampionEmail!.setValidators([
        Validators.required,
      ]);
    }
  }

  private exitPostDonationSuccess(donation: Donation, stripe_donation_method: string|undefined) {

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
    this.router.navigate(['thanks', donation.donationId], {
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
      this.loadFirstSavedStripeCardIfAny(id, jwt);
    }
  }

  onDonationSliderMove = (tipPercentage: number, tipAmount: number) => {
    this.tipAmountFromSlider = tipAmount;
    this.tipValue = tipAmount;
  }

  updateTipAmount = () => {
    this.tipAmountField?.setValue(this.tipValue);
  }

  continueFromPaymentStep() {
    if (! this.readyToProgressFromPaymentStep) {
      this.paymentStepErrors = this.paymentReadinessTracker.getErrorsBlockingProgress().join(" ");
      this.showErrorToast(this.paymentStepErrors);
      return;
    } else {
      this.paymentStepErrors = "";
      this.next()
    }
  }

  private getPaymentMethodType() {
    return (this.creditPenceToUse > 0) ? 'customer_balance' : 'card';
  }
}
