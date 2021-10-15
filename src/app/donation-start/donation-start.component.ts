import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { getCurrencySymbol, isPlatformBrowser } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { countries } from 'country-code-lookup';
import { debounceTime, distinctUntilChanged, map, retryWhen, startWith, switchMap, tap  } from 'rxjs/operators';
import { PaymentMethod, StripeElementChangeEvent } from '@stripe/stripe-js';
import { EMPTY, Observer } from 'rxjs';

import { AnalyticsService } from '../analytics.service';
import { Campaign } from './../campaign.model';
import { CampaignService } from '../campaign.service';
import { CharityCheckoutService } from '../charity-checkout.service';
import { Donation } from '../donation.model';
import { DonationCreatedResponse } from '../donation-created-response.model';
import { DonationService } from '../donation.service';
import { DonationStartErrorDialogComponent } from './donation-start-error-dialog.component';
import { DonationStartMatchConfirmDialogComponent } from './donation-start-match-confirm-dialog.component';
import { DonationStartMatchingExpiredDialogComponent } from './donation-start-matching-expired-dialog.component';
import { DonationStartOfferReuseDialogComponent } from './donation-start-offer-reuse-dialog.component';
import { environment } from '../../environments/environment';
import { ExactCurrencyPipe } from '../exact-currency.pipe';
import { GiftAidAddress } from '../gift-aid-address.model';
import { GiftAidAddressSuggestion } from '../gift-aid-address-suggestion.model';
import { PageMetaService } from '../page-meta.service';
import { PostcodeService } from '../postcode.service';
import { retryStrategy } from '../observable-retry';
import { StripeService } from '../stripe.service';
import { ValidateCurrencyMax } from '../validators/currency-max';
import { ValidateCurrencyMin } from '../validators/currency-min';

@Component({
  selector: 'app-donation-start',
  templateUrl: './donation-start.component.html',
  styleUrls: ['./donation-start.component.scss'],
})
export class DonationStartComponent implements AfterContentChecked, AfterContentInit, OnDestroy, OnInit {
  @ViewChild('cardInfo') cardInfo: ElementRef;
  @ViewChild('paymentRequestButton') paymentRequestButtonEl: ElementRef;
  @ViewChild('stepper') private stepper: MatStepper;
  card: any;
  cardHandler = this.onStripeCardChange.bind(this);
  paymentRequestButton: any;

  requestButtonShown = false;
  showChampionOptIn = false;

  campaign: Campaign;
  donation?: Donation;

  campaignOpenOnLoad: boolean;

  // Sort by name, with locale support so Åland Islands doesn't come after 'Z..'.
  // https://stackoverflow.com/a/39850483/2803757
  countryOptions = countries.sort((cA, cB)  => cA.country.localeCompare(cB.country));

  currencySymbol: string;

  donationForm: FormGroup;
  amountsGroup: FormGroup;
  giftAidGroup: FormGroup;
  paymentGroup: FormGroup;
  marketingGroup: FormGroup;

  maximumDonationAmount: number;
  noPsps = false;
  psp: 'enthuse' | 'stripe';
  retrying = false;
  skipPRBs: boolean;
  suggestedAmounts: {[key: string]: number[]};
  addressSuggestions: GiftAidAddressSuggestion[] = [];
  donationCreateError = false;
  donationUpdateError = false;
  /** setTimeout reference (timer ID) if applicable. */
  expiryWarning?: ReturnType<typeof setTimeout>; // https://stackoverflow.com/a/56239226
  loadingAddressSuggestions = false;
  privacyUrl = 'https://www.thebiggive.org.uk/s/privacy-policy';
  showAddressLookup: boolean;
  stripePaymentMethodReady = false;
  stripePRBMethodReady = false; // Payment Request Button (Apple/Google Pay) method set.
  stripeError?: string;
  submitting = false;
  termsProvider = `Big Give's`;
  termsUrl = 'https://www.thebiggive.org.uk/s/terms-and-conditions';
  // Track 'Next' clicks so we know when to show missing radio button error messages.
  triedToLeaveGiftAid = false;
  triedToLeaveMarketing = false;

  private campaignId: string;
  private defaultCountryCode: string;
  private enthuseError?: string;  // Enthuse donation start error message
  private previousDonation?: Donation;
  private stepHeaderEventsSet = false;
  private tipPercentageChanged = false;

  private initialTipSuggestedPercentage = 15;
  // Based on https://stackoverflow.com/questions/164979/regex-for-matching-uk-postcodes#comment82517277_164994
  // but modified to make the separating space optional.
  // Note this must be a pattern *string*, NOT a RegExp. https://stackoverflow.com/a/42392880/2803757
  private postcodeRegExpPattern = '^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\\s?[0-9][A-Za-z]{2})$';

  constructor(
    private analyticsService: AnalyticsService,
    private cd: ChangeDetectorRef,
    private charityCheckoutService: CharityCheckoutService,
    public dialog: MatDialog,
    private donationService: DonationService,
    @Inject(ElementRef) private elRef: ElementRef,
    private formBuilder: FormBuilder,
    private pageMeta: PageMetaService,
    private postcodeService: PostcodeService,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private stripeService: StripeService,
  ) {
    this.defaultCountryCode = this.donationService.getDefaultCounty();

    route.queryParams.forEach((params: Params) => {
      if (params.error) {
        this.enthuseError = params.error;
      }
    });
  }

  ngOnDestroy() {
    if (this.donation) {
      this.clearDonation(this.donation, false);
    }

    if (this.card) {
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.stripeService.init();
    }

    this.campaign = this.route.snapshot.data.campaign;
    this.setCampaignBasedVars();

    const formGroups: {
      amounts: FormGroup,   // Matching reservation happens at the end of this group.
      payment?: FormGroup,  // Added in Stripe mode only.
      giftAid: FormGroup,
      marketing: FormGroup,
    } = {
      amounts: this.formBuilder.group({
        donationAmount: [null, [
          Validators.required,
          ValidateCurrencyMin,
          ValidateCurrencyMax,
          Validators.pattern('^[£$]?[0-9]+?(\\.00)?$'),
        ]],
        coverFee: [false],
        feeCoverAmount: [null],
        tipPercentage: [this.initialTipSuggestedPercentage], // See addStripeValidators().
        tipAmount: [null], // See addStripeValidators().
      }),
      giftAid: this.formBuilder.group({
        giftAid: [null],        // See addUKValidators().
        homeAddress: [null],  // See addStripeValidators().
        homeBuildingNumber: [null],
        homePostcode: [null], // See addStripeValidators().
      }),
      marketing: this.formBuilder.group({
        optInCharityEmail: [null, Validators.required],
        optInTbgEmail: [null, Validators.required],
        optInChampionEmail: [null],
      }),
      // T&Cs agreement is implicit through submitting the form.
    };

    if (this.psp === 'stripe') {
      formGroups.payment = this.formBuilder.group({
        firstName: [null],        // See addStripeValidators().
        lastName: [null],         // See addStripeValidators().
        emailAddress: [null],     // See addStripeValidators().
        billingCountry: [this.defaultCountryCode], // See addStripeValidators().
        billingPostcode: [null],  // See addStripeValidators().
      });
    }

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

    this.maximumDonationAmount = environment.maximumDonationAmount;
    this.skipPRBs = !environment.psps.stripe.prbEnabled;

    // We need each donor to get a randomised but consistent for them set of
    // amount suggestions, while we support variant tests of this. So
    // we can't set this up for them on the server. It is therefore best
    // to skip this entirely on the server side and always have it return
    // suggestions, then have them 'injected' as the page loads when
    // appropriate based on the options applicable for the particular donor.
    if (isPlatformBrowser(this.platformId)) {
      this.suggestedAmounts = this.donationService.getSuggestedAmounts();
      this.handleCampaignViewUpdates();
    }

    this.donationService.getProbablyResumableDonation(this.campaignId)
      .subscribe((existingDonation: (Donation|undefined)) => {
        this.previousDonation = existingDonation;

        if (this.enthuseError) {
          this.processEnthuseDonationError();
          return;
        }

        // The local check might not have the latest donation status in edge cases, so we need to check the copy
        // the Donations API returned still has a resumable status and wasn't completed or cancelled since being
        // saved locally.
        if (!existingDonation || !this.donationService.isResumable(existingDonation)) {
          // No resumable donations
          return;
        }

        // We have a resumable donation and aren't processing an error
        this.offerExistingDonation(existingDonation);
    });
  }

  ngAfterContentInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.showAddressLookup =
      this.psp === 'stripe' &&
      environment.postcodeLookupKey &&
      environment.postcodeLookupUri;

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

  haveAddressSuggestions(): boolean {
    return this.addressSuggestions.length > 0;
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
      this.giftAidGroup.get('homePostcode')?.disable(); // TODO probably need a link to force override this.
    });
  }

  async stepChanged(event: StepperSelectionEvent) {
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
          this.analyticsService.logEvent(
            'cancel_auto',
            `Donation cancelled because amount was updated ${this.donation?.donationId} to campaign ${this.campaignId}`,
          );

          if (this.donation) {
            this.clearDonation(this.donation, true);
          }
          this.createDonation(); // Re-sets-up PRB etc.
        });

      return;
    }

    if (this.donation && event.selectedIndex > 1) {
      // After create() update all Angular form data on step changes, except billing
      // postcode & country which can be set manually or via PRB callbacks.
      if (this.paymentGroup) {
        this.donation.emailAddress = this.paymentGroup.value.emailAddress;
        this.donation.firstName = this.paymentGroup.value.firstName;
        this.donation.lastName = this.paymentGroup.value.lastName;
      }

      this.donation.feeCoverAmount = this.sanitiseCurrency(this.amountsGroup.value.feeCoverAmount);

      this.donation.giftAid = this.giftAidGroup.value.giftAid;

      // In alternative fee model, 'tip' is donor fee cover so not Gift Aid eligible.
      this.donation.tipGiftAid = this.campaign.feePercentage ? false : this.giftAidGroup.value.giftAid;

      this.donation.optInCharityEmail = this.marketingGroup.value.optInCharityEmail;
      this.donation.optInTbgEmail = this.marketingGroup.value.optInTbgEmail;
      this.donation.optInChampionEmail = this.marketingGroup.value.optInChampionEmail;
      this.donation.tipAmount = this.sanitiseCurrency(this.amountsGroup.value.tipAmount);

      if (this.donation.giftAid || this.donation.tipGiftAid) {
        this.donation.homePostcode = this.giftAidGroup.value.homePostcode;
        this.donation.homeAddress = this.giftAidGroup.value.homeAddress;
        // Optional additional field to improve data alignment w/ HMRC when a lookup was used.
        this.donation.homeBuildingNumber = this.giftAidGroup.value.homeBuildingNumber || undefined;
      } else {
        this.donation.homePostcode = undefined;
        this.donation.homeAddress = undefined;
        this.donation.homeBuildingNumber = undefined;
      }
      this.donationService.updateLocalDonation(this.donation);

      if (this.donation.psp === 'stripe') {
        if (event.selectedStep.label === 'Receive updates') {
          // Step 2 'Details' – whichever step(s) come before marketing prefs is the best fit for this #.
          this.analyticsService.logCheckoutStep(2, this.campaign, this.donation);
        } else if (event.selectedStep.label === 'Confirm') {
          // Step 3 'Confirm'.
          this.analyticsService.logCheckoutStep(2, this.campaign, this.donation);
        }
        // Else it's not a step that cleanly maps to the historically-comparable
        // e-commece funnel steps defined in our Analytics campaign, besides 1
        // (which we fire on donation create API callback) and 4 (which we fire
        // alongside calling payWithStripe()).
      }
    }

    // Create a donation if coming from first step and not offering to resume
    // an existing donation and not just patching tip amount on `donation`
    // having already gone forward then back in the form.
    if (event.previouslySelectedStep.label === 'Your donation') {
      if (
        !this.donation && // No change or only tip amount changed, if we got here.
        (this.previousDonation === undefined || this.previousDonation.status === 'Cancelled') &&
        event.selectedStep.label !== 'Your donation' // Resets fire a 0 -> 0 index event.
      ) {
        this.createDonation();
      }

      if (this.psp === 'stripe') {
        // Card element is mounted the same way regardless of donation info. See
        // this.createDonation().subscribe(...) for Payment Request Button mount, which needs donation info
        // first and so happens in `preparePaymentRequestButton()`.
        this.card = this.stripeService.getCard();
        if (this.cardInfo && this.card) { // Ensure #cardInfo not hidden by PRB success.
          this.card.mount(this.cardInfo.nativeElement);
          this.card.addEventListener('change', this.cardHandler);
        }
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

  async onStripeCardChange(state: StripeElementChangeEvent) {
    this.stripePRBMethodReady = false; // Using card instead
    this.addStripeCardBillingValidators();

    this.stripePaymentMethodReady = state.complete;
    if (state.error) {
      this.stripeError = `Payment method update failed: ${state.error.message}`;
    } else {
      this.stripeError = undefined; // Clear any previous card errors if number fixed.
    }

    // Jump back if we get an out of band message back that the card is *not* valid/ready.
    // Don't jump forward when the card *is* valid, as the donor might have been
    // intending to edit something else in the `payment` step; let them click Next.
    if (!this.donation || !this.stripePaymentMethodReady) {
      this.jumpToStep('Payment details');

      return;
    }

    const paymentMethodResult = await this.stripeService.createPaymentMethod(
      this.card,
      `${this.paymentGroup.value.firstName} ${this.paymentGroup.value.lastName}`,
    );

    if (paymentMethodResult.error) {
      this.stripeError = `Payment setup failed:  ${paymentMethodResult.error.message}`;
      this.submitting = false;
      this.analyticsService.logError('stripe_payment_method_error', paymentMethodResult.error.message ?? '[No message]');

      return;
    }

    if (!paymentMethodResult.paymentMethod) {
      this.analyticsService.logError('stripe_payment_method_error_invalid_response', 'No error or paymentMethod');
      return;
    }

    // Because we don't necessarily have the other needed minimum data to put() the donation
    // yet, we just have StripeService keep a local copy of this info until later.
    this.stripeService.setLastCardMetadata(
      paymentMethodResult.paymentMethod?.card?.brand,
      paymentMethodResult.paymentMethod?.card?.country || 'N/A',
    );
  }

  setAmount(amount: number) {
    // We need to keep this as a string for consistency with manual donor-input amounts,
    // so that `submit()` doesn't fall over trying to clean it of possible currency symbols.
    this.amountsGroup.patchValue({ donationAmount: amount.toString() });
  }

  async submit() {
    if (!this.donation || this.donationForm.invalid) {
      return;
    }

    if (
      this.psp === 'stripe' &&
      this.paymentGroup &&
      !this.donation?.billingPostalAddress &&
      this.paymentGroup.value.billingPostcode
    ) {
      this.donation.billingPostalAddress = this.paymentGroup.value.billingPostcode;
      this.donation.countryCode = this.paymentGroup.value.billingCountry;
      this.donationService.updateLocalDonation(this.donation);
    }

    this.submitting = true;
    this.enthuseError = undefined;
    this.donationUpdateError = false;

    // Can't proceed if campaign info not looked up yet or no usable PSP
    if (!this.donation || !this.campaign || !this.campaign.charity.id || !this.psp) {
      this.donationUpdateError = true;
      return;
    }

    this.donationService
      .update(this.donation)
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
        if (donation.psp === 'enthuse') {
          this.cancelExpiryWarning();
          this.redirectToEnthuse(donation, this.campaign.charity.logoUri);
          return;
        } else if (donation.psp === 'stripe') {
          this.analyticsService.logCheckoutStep(4, this.campaign, donation); // 'Pay'.
          this.payWithStripe();
        }
      }, response => {
        let errorMessage: string;
        if (response.message) {
          errorMessage = `Could not update donation for campaign ${this.campaignId}: ${response.message}`;
        } else {
          // Unhandled 5xx crashes etc.
          errorMessage = `Could not update donation for campaign ${this.campaignId}: HTTP code ${response.status}`;
        }
        this.analyticsService.logError('donation_update_failed', errorMessage);
        this.retrying = false;
        this.donationUpdateError = true;
        this.submitting = false;
      });
  }

  async payWithStripe() {
    if (!this.donation || !this.donation.clientSecret) {
      this.stripeError = 'Missing data from previous step – please refresh and try again';
      this.analyticsService.logError('stripe_pay_missing_secret', `Donation ID: ${this.donation?.donationId}`);
      return;
    }

    const result = await this.stripeService.confirmPayment(this.donation, this.card);

    if (!result || result.error) {
      if (result) {
        this.stripeError = `Payment processing failed: ${result.error.message}`;
      }
      this.submitting = false;

      return;
    }

    if (!result.paymentIntent) {
      this.analyticsService.logError('stripe_pay_missing_pi', 'No error or paymentIntent');
      return;
    }

    // See https://stripe.com/docs/payments/intents
    if (['succeeded', 'processing'].includes(result.paymentIntent.status)) {
      const eventAction = (this.stripePRBMethodReady ? 'stripe_prb_payment_success' : 'stripe_card_payment_success');
      this.analyticsService.logEvent(
        eventAction,
        `Stripe Intent processing or done for donation ${this.donation.donationId} to campaign ${this.campaignId}`,
      );
      this.analyticsService.logCheckoutDone(this.campaign, this.donation);
      this.cancelExpiryWarning();
      this.router.navigate(['thanks', this.donation.donationId], {
        replaceUrl: true,
      });

      return;
    }

    // else Intent 'done' but not a successful status.
    this.analyticsService.logError('stripe_intent_not_success', result.paymentIntent.status);
    this.stripeError = `Status: ${result.paymentIntent.status}`;
    this.submitting = false;
  }

  get donationAmountField() {
    if (!this.donationForm) {
      return undefined;
    }

    return this.donationForm.controls.amounts.get('donationAmount');
  }

  get tipAmountField() {
    if (!this.donationForm) {
      return undefined;
    }

    return this.donationForm.controls.amounts.get('tipAmount');
  }

  /**
   * Quick getter for donation amount, to keep template use concise.
   */
  get donationAmount(): number {
    return this.sanitiseCurrency(this.amountsGroup.value.donationAmount);
  }

  /**
   * Donation plus any tip and/or fee cover.
   */
  get donationAndExtrasAmount(): number {
    return this.donationAmount + this.tipAmount() + this.feeCoverAmount();
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
    return this.sanitiseCurrency(this.amountsGroup.value.feeCoverAmount);
  }

  giftAidAmount(): number {
    return this.giftAidGroup.value.giftAid ? (0.25 * this.donationAmount) : 0;
  }

  tipAmount(): number {
    return this.sanitiseCurrency(this.amountsGroup.value.tipAmount);
  }

  expectedTotalAmount(): number {
    return this.donationAmount + this.giftAidAmount() + this.expectedMatchAmount();
  }

  reservationExpiryTime(): Date | undefined {
    if (!this.donation?.createdTime || !this.donation.matchReservedAmount) {
      return undefined;
    }

    return new Date(environment.reservationMinutes * 60000 + (new Date(this.donation.createdTime)).getTime());
  }

  /**
   * @returns Amount without any £/$s
   */
  sanitiseCurrency(amount: string): number {
    return Number((amount || '0').replace('£', '').replace('$', ''));
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
    if (!this.goToFirstVisibleError()) {
      this.stepper.next();
    }
  }

  private jumpToStep(stepLabel: string) {
    this.stepper.steps
      .filter(step => step.label === stepLabel)
      [0]
      .select();

    this.cd.detectChanges();
  }

  /**
   * Unlike the CampaignService method which is more forgiving if the status gets stuck Active (we don't trust
   * these to be right in Salesforce yet), this check relies solely on campaign dates.
   */
  private campaignIsOpen(): boolean {
    return (
      this.campaign
        ? (new Date(this.campaign.startDate) <= new Date() && new Date(this.campaign.endDate) > new Date())
        : false
      );
  }

  /**
   * @returns whether any errors were found in the visible viewport.
   */
  private goToFirstVisibleError(): boolean {
    const stepper = this.elRef.nativeElement.querySelector('#stepper');
    const steps = stepper.getElementsByClassName('mat-step');
    const stepJustDone = steps[this.stepper.selectedIndex];
    const firstElInStepWithAngularError = stepJustDone.querySelector('.ng-invalid[formControlName]');
    if (firstElInStepWithAngularError) {
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

  /**
   * Redirect if campaign's not open yet; set up page metadata if it is
   */
  private setCampaignBasedVars() {
    this.campaignId = this.campaign.id;

    // We want to let donors finish the journey if they're on the page before the campaign
    // close date and it passes while they're completing the form – in particular they should
    // be able to use match funds secured until 15 minutes after the close time.
    this.campaignOpenOnLoad = this.campaignIsOpen();

    this.currencySymbol = getCurrencySymbol(this.campaign.currencyCode, 'narrow', 'en-GB');

    if (this.campaign.parentRef === 'gogiveone') {
      this.termsProvider = 'Go Give One';
      this.privacyUrl = 'https://www.thebiggive.org.uk/s/gogiveone-privacy';
      this.termsUrl = 'https://www.thebiggive.org.uk/s/gogiveone-terms';
    }

    if (environment.psps.stripe.enabled && this.campaign.charity.stripeAccountId) {
      this.psp = 'stripe';
    } else if (environment.psps.enthuse.enabled) {
      this.psp = 'enthuse';
    } else {
      this.noPsps = true;
    }

    if (this.campaign.championOptInStatement) {
      this.showChampionOptIn = true;
    }
  }

  private handleCampaignViewUpdates() {
    if (this.campaign.currencyCode === 'GBP') {
      this.addUKValidators();
    }

    if (this.psp === 'stripe') {
      this.addStripeValidators();
    }

    this.setChampionOptInValidity();

    this.analyticsService.logCampaignChosen(this.campaign);

    // auto redirect back to campaign page if donations not open yet
    if (!CampaignService.isOpenForDonations(this.campaign)) {
      this.router.navigateByUrl(`/campaign/${this.campaign.id}`, { replaceUrl: true });
      return;
    }

    this.pageMeta.setCommon(
      `Donate to ${this.campaign.charity.name}`,
      `Donate to the "${this.campaign.title}" campaign`,
      this.campaign.currencyCode !== 'GBP',
      this.campaign.bannerUri,
    );
  }

  private createDonation(): void {
    if (!this.campaign || !this.campaign.charity.id || !this.psp) {
      this.donationCreateError = true;
      return;
    }

    this.donationCreateError = false;

    const donation: Donation = {
      charityId: this.campaign.charity.id,
      charityName: this.campaign.charity.name,
      countryCode: this.paymentGroup?.value.billingCountry || 'GB', // Group N/A for Enthuse.
      currencyCode: this.campaign.currencyCode || 'GBP',
      donationAmount: this.sanitiseCurrency(this.amountsGroup.value.donationAmount),
      donationMatched: this.campaign.isMatched,
      feeCoverAmount: this.sanitiseCurrency(this.amountsGroup.value.feeCoverAmount),
      matchedAmount: 0, // Only set >0 after donation completed
      matchReservedAmount: 0, // Only set >0 after initial donation create API response
      projectId: this.campaignId,
      psp: this.psp,
      tipAmount: this.sanitiseCurrency(this.amountsGroup.value.tipAmount),
    };

    // No re-tries for create() where donors have only entered amounts. If the
    // server is having problem it's probably more helpful to fail immediately than
    // to wait until they're ~10 seconds into further data entry before jumping
    // back to the start.
    this.donationService.create(donation)
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
    this.analyticsService.logError('donation_create_failed', errorMessage);
    this.donationCreateError = true;
    this.stepper.previous(); // Go back to step 1 to surface the internal error.
  }

  private preparePaymentRequestButton(donation: Donation, paymentGroup: FormGroup) {
    if (this.skipPRBs) {
      return;
    }

    if (this.paymentRequestButton) {
      delete this.paymentRequestButton;
    }

    const paymentRequestResultObserver: Observer<PaymentMethod.BillingDetails | undefined> = {
      next: (billingDetails?: PaymentMethod.BillingDetails) => {
        if (billingDetails && donation) {
          this.analyticsService.logEvent(
            'stripe_prb_setup_success',
            `Stripe PRB success for donation ${donation.donationId} to campaign ${this.campaignId}`,
          );

          // Set form and `donation` billing fields from PRB card's data.
          paymentGroup.patchValue({
            billingCountry: billingDetails.address?.country,
            billingPostcode: billingDetails.address?.postal_code,
          });

          this.stripePaymentMethodReady = true;
          this.stripePRBMethodReady = true;
          this.removeStripeCardBillingValidators();
          this.jumpToStep('Receive updates');

          return;
        }

        this.stripePaymentMethodReady = false;
        this.stripePRBMethodReady = false;
        this.addStripeCardBillingValidators();
        this.stripeError = 'Payment failed – please try again';
      },
      error: (err) => {
        this.stripePaymentMethodReady = false;
        this.stripePRBMethodReady = false;
        this.addStripeCardBillingValidators();
        this.stripeError = 'Payment method handling failed';
      },
      complete: () => {},
    };

    this.paymentRequestButton = this.stripeService.getPaymentRequestButton(donation, paymentRequestResultObserver);

    this.stripeService.canUsePaymentRequest().then(canUse => {
      if (canUse) {
        this.paymentRequestButton.mount(this.paymentRequestButtonEl.nativeElement);
        this.requestButtonShown = true;
      } else {
        this.paymentRequestButtonEl.nativeElement.style.display = 'none';
      }
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
        `Missing expected response data creating new donation for campaign ${this.campaignId}`,
      );
      this.donationCreateError = true;
      this.stepper.previous(); // Go back to step 1 to surface the internal error.

      return;
    }

    this.donationService.saveDonation(response.donation, response.jwt);
    this.donation = response.donation; // Simplify update() while we're on this page.

    this.analyticsService.logAmountChosen(
      response.donation.donationAmount,
      this.campaignId,
      this.suggestedAmounts[this.campaign.currencyCode],
      this.campaign.currencyCode,
    );

    if (this.psp === 'stripe') {
      this.analyticsService.logCheckoutStep(1, this.campaign, this.donation);

      this.preparePaymentRequestButton(this.donation, this.paymentGroup);
    }

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

    this.scheduleMatchingExpiryWarning(this.donation);
  }

  private offerExistingDonation(donation: Donation) {
    this.analyticsService.logEvent('existing_donation_offered', `Found pending donation to campaign ${this.campaignId}`);

    // Ensure we do not claim match funds are reserved when offering an old
    // donation if the reservation time is up.
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
    // than e.g. always using 15 minutes.
    const msUntilExpiryTime = environment.reservationMinutes * 60000 + new Date(donation.createdTime).getTime() - Date.now();

    // Only set the timeout when relevant part 2/2: exclude cases where
    // the timeout has already passed. This happens e.g. when the reuse
    // dialog is shown because of matching expiry and the donor chooses
    // to continue anyway without matching.
    if (msUntilExpiryTime < 0) {
      return;
    }

    this.expiryWarning = setTimeout(() => {
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
   * Auto-cancel the attempted donation (it's unlikely to start working for the same project immediately so better to start a
   * 'clean' one) and let the user know about the error.
   */
  private processEnthuseDonationError() {
    this.analyticsService.logError(
      'charity_checkout_error', // Keep event name for historic comparisons
      `Enthuse rejected donation setup for campaign ${this.campaignId}: ${this.enthuseError}`,
    );

    if (this.previousDonation) {
      this.analyticsService.logEvent(
        'cancel_auto',
        `Cancelled failing donation ${this.previousDonation.donationId} to campaign ${this.campaignId}`,
      );
      this.donationService.cancel(this.previousDonation).subscribe(() => {
        if (!this.previousDonation) {
          return;
        }
        this.clearDonation(this.previousDonation, true);
      });
    }

    const errorDialog = this.dialog.open(DonationStartErrorDialogComponent, {
      data: { pspError: this.enthuseError },
      disableClose: true,
      role: 'alertdialog',
    });

    errorDialog.afterClosed().subscribe(() => {
      // Direct user to project page without the error URL param, so returning from browser history or sharing the link
      // doesn't show the error again.
      this.router.navigate(['donate', this.campaignId], {
        queryParams: { error: null },
        replaceUrl: true,
      });
    });
  }

  private clearDonation(donation: Donation, clearAllRecord: boolean) {
    if (clearAllRecord) { // i.e. don't keep donation around for /thanks/... or reuse.
      this.donationService.removeLocalDonation(donation);
    }

    this.cancelExpiryWarning();

    if (this.paymentRequestButton) {
      delete this.paymentRequestButton;
    }

    delete this.donation;
  }

  private redirectToEnthuse(donation: Donation, logoUri?: string) {
    this.analyticsService.logEvent('payment_redirect_click', `Donating to campaign ${this.campaignId}`);
    this.charityCheckoutService.startDonation(donation, logoUri);
  }

  private promptToContinueWithNoMatchingLeft(donation: Donation) {
    this.analyticsService.logEvent('alerted_no_match_funds', `Asked donor whether to continue for campaign ${this.campaignId}`);
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
    this.analyticsService.logEvent('alerted_partial_match_funds', `Asked donor whether to continue for campaign ${this.campaignId}`);
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
    this.giftAidGroup.controls.giftAid.setValidators([Validators.required]);
  }

  private addStripeValidators(): void {
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
          ? this.getTipOrFeeAmount(this.campaign.feePercentage, donationAmount)
          : '0.00';

        this.amountsGroup.patchValue({ feeCoverAmount });
      });
    } else {
      // On the default fee model, we need to listen for tip percentage
      // field changes and don't have a cover fee checkbox.
      this.amountsGroup.controls.tipAmount.setValidators([
        Validators.required,
        Validators.pattern('^[£$]?[0-9]+?(\\.[0-9]{2})?$'),
      ]);

      this.amountsGroup.get('donationAmount')?.valueChanges.subscribe(donationAmount => {
        const updatedValues: {
          tipPercentage?: number | string,
          tipAmount?: string,
        } = {};

        if (!this.tipPercentageChanged) {
          let newDefault = this.initialTipSuggestedPercentage;
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

      this.amountsGroup.get('tipPercentage')?.valueChanges.subscribe(tipPercentage => {
        if (tipPercentage === 'Other') {
          return;
        }

        this.amountsGroup.patchValue({
          // Keep value consistent with format of manual string inputs.
          tipAmount: this.getTipOrFeeAmount(tipPercentage, this.donationAmount),
        });
      });
    }

    // Gift Aid home address fields are validated only in Stripe mode and also
    // conditionally on the donor claiming Gift Aid.
    this.giftAidGroup.get('giftAid')?.valueChanges.subscribe(giftAidChecked => {
      if (giftAidChecked) {
        this.giftAidGroup.controls.homePostcode.setValidators([
          Validators.required,
          Validators.pattern(this.postcodeRegExpPattern),
        ]);
        this.giftAidGroup.controls.homeAddress.setValidators([
          Validators.required,
          Validators.maxLength(255),
        ]);
      } else {
        this.giftAidGroup.controls.homePostcode.setValidators([]);
        this.giftAidGroup.controls.homeAddress.setValidators([]);
      }

      this.giftAidGroup.controls.homePostcode.updateValueAndValidity();
      this.giftAidGroup.controls.homeAddress.updateValueAndValidity();
    });

    this.paymentGroup.controls.firstName.setValidators([
      Validators.maxLength(40),
      Validators.required,
    ]);
    this.paymentGroup.controls.lastName.setValidators([
      Validators.maxLength(80),
      Validators.required,
    ]);
    this.paymentGroup.controls.emailAddress.setValidators([
      Validators.required,
      Validators.email,
    ]);

    this.addStripeCardBillingValidators();
  }

  private removeStripeCardBillingValidators() {
    this.paymentGroup.controls.billingCountry.setValidators([]);
    this.paymentGroup.controls.billingPostcode.setValidators([]);
  }

  private addStripeCardBillingValidators() {
    this.paymentGroup.controls.billingCountry.setValidators([
      Validators.required,
    ]);
    this.paymentGroup.controls.billingPostcode.setValidators([
      Validators.required,
      Validators.pattern('^[0-9a-zA-Z ]{2,8}$'),
    ]);
  }

  /**
   * @param percentage  e.g. from select field or a custom fee model campaign fee level.
   * @param donationAmount  Sanitised, e.g. via get() helper `donationAmount`.
   * @returns Tip or fee cover amount as a decimal string, as if input directly into a form field.
   */
  private getTipOrFeeAmount(percentage: number, donationAmount?: number): string {
    return (percentage / 100 * (donationAmount || 0))
      .toFixed(2);
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

        this.scheduleMatchingExpiryWarning(this.donation);

        if (this.psp === 'stripe') {
          this.preparePaymentRequestButton(this.donation, this.paymentGroup);
        }

        // In doc block use case (a), we need to put the amounts from the previous
        // donation into the form and move to Step 2.
        const tipPercentageFixed = (100 * donation.tipAmount / donation.donationAmount).toFixed(1);
        let tipPercentage;

        if (['7.5', '10.0', '12.5', '15.0'].includes(tipPercentageFixed)) {
          tipPercentage = Number(tipPercentageFixed);
        } else {
          tipPercentage = 'Other';
        }

        this.amountsGroup.patchValue({
          donationAmount: donation.donationAmount.toString(),
          tipAmount: donation.tipAmount.toString(),
          tipPercentage,
        });

        if (this.stepper.selected?.label === 'Your donation') {
          this.jumpToStep(donation.currencyCode === 'GBP' ? 'Gift Aid' : 'Payment details');
        }

        return;
      }

      // Else cancel the existing donation and remove our local record.
      this.donationService.cancel(donation)
        .subscribe(
          () => {
            this.analyticsService.logEvent('cancel', `Donor cancelled donation ${donation.donationId} to campaign ${this.campaignId}`),

            this.clearDonation(donation, true);

            // Go back to 1st step to encourage donor to try again
            this.stepper.reset();
            this.amountsGroup.patchValue({ tipPercentage: this.initialTipSuggestedPercentage });
            this.tipPercentageChanged = false;
            if (this.paymentGroup) {
              this.paymentGroup.patchValue({ billingCountry: this.defaultCountryCode });
            }
          },
          response => {
            this.analyticsService.logError(
              'cancel_failed',
              `Could not cancel donation ${donation.donationId} to campaign ${this.campaignId}: ${response.error.error}`,
            );
          },
        );
    };
  }

  private setChampionOptInValidity() {
    if (this.showChampionOptIn) {
      this.marketingGroup.controls.optInChampionEmail.setValidators([
        Validators.required,
      ]);
    }
  }
}
