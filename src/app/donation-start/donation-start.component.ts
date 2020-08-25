import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { retryWhen, tap  } from 'rxjs/operators';
import { StripeElementChangeEvent } from '@stripe/stripe-js';

import { AnalyticsService } from '../analytics.service';
import { Campaign } from './../campaign.model';
import { CharityCheckoutService } from '../charity-checkout.service';
import { CampaignService } from '../campaign.service';
import { Donation } from '../donation.model';
import { DonationCreatedResponse } from '../donation-created-response.model';
import { DonationService } from '../donation.service';
import { DonationStartErrorDialogComponent } from './donation-start-error-dialog.component';
import { DonationStartMatchConfirmDialogComponent } from './donation-start-match-confirm-dialog.component';
import { DonationStartOfferReuseDialogComponent } from './donation-start-offer-reuse-dialog.component';
import { environment } from '../../environments/environment';
import { ExactCurrencyPipe } from '../exact-currency.pipe';
import { PageMetaService } from '../page-meta.service';
import { retryStrategy } from '../observable-retry';
import { StripeService } from '../stripe.service';
import { ValidateCurrencyMax } from '../validators/currency-max';
import { ValidateCurrencyMin } from '../validators/currency-min';

@Component({
  selector: 'app-donation-start',
  templateUrl: './donation-start.component.html',
  styleUrls: ['./donation-start.component.scss'],
})
export class DonationStartComponent implements AfterContentChecked, OnDestroy, OnInit {
  @ViewChild('cardInfo') cardInfo: ElementRef;
  @ViewChild('stepper') private stepper: MatStepper;
  card: any;
  cardHandler = this.onStripeCardChange.bind(this);

  campaign?: Campaign;
  donation: Donation;

  donationForm: FormGroup;
  amountsGroup: FormGroup;
  giftAidGroup: FormGroup;
  personalAndMarketingGroup: FormGroup;
  paymentAndAgreementGroup: FormGroup;

  maximumDonationAmount: number;
  noPsps = false;
  psp: 'enthuse' | 'stripe';
  retrying = false;
  suggestedAmounts?: number[];
  donationCreateError = false;
  donationUpdateError = false;
  stripeCardReady = false;
  stripeError?: string;
  submitting = false;
  // Track 'Next' clicks so we know when to show missing radio button error messages.
  triedToLeaveGiftAid = false;
  triedToLeavePersonalAndMarketing = false;

  private campaignId: string;
  private enthuseError?: string;  // Enthuse donation start error message
  private previousDonation?: Donation;
  private stepHeaderEventsSet = false;

  // Based on https://stackoverflow.com/questions/164979/regex-for-matching-uk-postcodes#comment82517277_164994
  // but modified to make the separating space optional.
  private postcodeRegExp = new RegExp('^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\\s?[0-9][A-Za-z]{2})$');

  constructor(
    private analyticsService: AnalyticsService,
    private campaignService: CampaignService,
    private cd: ChangeDetectorRef,
    private charityCheckoutService: CharityCheckoutService,
    public dialog: MatDialog,
    private donationService: DonationService,
    @Inject(ElementRef) private elRef: ElementRef,
    private formBuilder: FormBuilder,
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
    private router: Router,
    private state: TransferState,
    private stripeService: StripeService,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
    route.queryParams.forEach((params: Params) => {
      if (params.error) {
        this.enthuseError = params.error;
      }
    });
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
    delete this.campaign;
    delete this.donation;
  }

  ngOnInit() {
    this.donationForm = this.formBuilder.group({
      // Matching reservation happens at the end of this group.
      amounts: this.formBuilder.group({
        donationAmount: [null, [
          Validators.required,
          ValidateCurrencyMin,
          ValidateCurrencyMax,
          Validators.pattern('^£?[0-9]+?(\\.00)?$'),
        ]],
        tipAmount: [null], // See addStripeValidators().
      }),
      giftAid: this.formBuilder.group({
        giftAid: [null, Validators.required],
        homeAddress: [null],  // See addStripeValidators().
        homePostcode: [null], // See addStripeValidators().
      }),
      personalAndMarketing: this.formBuilder.group({
        firstName: [null],    // See addStripeValidators().
        lastName: [null],     // See addStripeValidators().
        emailAddress: [null], // See addStripeValidators().
        optInCharityEmail: [null, Validators.required],
        optInTbgEmail: [null, Validators.required],
      }),
      // T&Cs agreement is implicit through submitting the form.
      paymentAndAgreement: this.formBuilder.group({
        billingPostcode: [null], // See addStripeValidators().
      }),
    });

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

    const personalAndMarketingGroup: any = this.donationForm.get('personalAndMarketing');
    if (personalAndMarketingGroup != null) {
      this.personalAndMarketingGroup = personalAndMarketingGroup;
    }

    const paymentAndAgreementGroup: any = this.donationForm.get('paymentAndAgreement');
    if (paymentAndAgreementGroup != null) {
      this.paymentAndAgreementGroup = paymentAndAgreementGroup;
    }

    this.maximumDonationAmount = environment.maximumDonationAmount;
    const suggestedAmountsKey = makeStateKey<number[]>('suggested-amounts');
    this.suggestedAmounts = this.state.get(suggestedAmountsKey, undefined);
    if (this.suggestedAmounts === undefined) {
      this.suggestedAmounts = this.getSuggestedAmounts();
      this.state.set(suggestedAmountsKey, this.suggestedAmounts);
    }

    const campaignKey = makeStateKey<Campaign>(`campaign-${this.campaignId}`);

    // Largely for simpler unit testing, allow `campaign` to be set directly and check for this.
    // In the future we might want to consider mocking TransferState instead.
    if (!this.campaign) {
      this.campaign = this.state.get(campaignKey, undefined);
    }

    if (this.campaign) {
      this.handleCampaign(this.campaign);
    } else {
      this.campaignService.getOneById(this.campaignId)
        .subscribe(campaign => {
          this.state.set(campaignKey, campaign);
          this.campaign = campaign;
          this.handleCampaign(campaign);
        });
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

    // Can't do it, or already did it.
    if (!this.stepper || this.stepHeaderEventsSet) {
      return;
    }

    const stepperHeaders = stepper.getElementsByClassName('mat-step-header');
    for (const stepperHeader of stepperHeaders) {
      stepperHeader.addEventListener('click', (clickEvent: any) => {
        if (clickEvent.target.innerText.includes('Your details') && this.stepper.selected.label === 'Gift Aid') {
          this.triedToLeaveGiftAid = true;
        }

        if (clickEvent.target.innerText.includes('Confirm & pay') && this.stepper.selected.label === 'Your details') {
          this.triedToLeavePersonalAndMarketing = true;
        }

        this.goToFirstVisibleError();
      });
    }

    this.stepHeaderEventsSet = true;
  }

  async stepChanged(event: StepperSelectionEvent) {

    // If the original donation amount was updated, cancel that donation,
    // we'll create a new one later on for this updated amount.
    if (this.donation !== undefined && this.donationAmount > 0 && this.donationAmount !== this.donation.donationAmount) {
      this.analyticsService.logEvent(
        'cancel_auto',
        `Donation cancelled because amount was updated ${this.donation.donationId} to campaign ${this.campaignId}`,
      );
      this.donationService.cancel(this.donation).subscribe(() => this.donationService.removeLocalDonation(this.donation));
    }

    // Stepper is 0-indexed and checkout steps are 1-indexed, so we can send the new
    // stepper index to indicate that the previous step was done.
    // We can only do this here from step 2 because we need the donation object
    // first, and it is set up asynchronously after Step 1. See `Donation.Service.create()`
    // success subscriber for where we handle the post-Step 1 event.
    if (this.donation && event.selectedIndex > 1) {
      // After create(), update all Angular form data except billing postcode
      // (which is in the final step) on step changes.
      this.donation.emailAddress = this.personalAndMarketingGroup.value.emailAddress;
      this.donation.firstName = this.personalAndMarketingGroup.value.firstName;
      this.donation.giftAid = this.giftAidGroup.value.giftAid;
      this.donation.tipGiftAid = this.giftAidGroup.value.giftAid;
      this.donation.lastName = this.personalAndMarketingGroup.value.lastName;
      this.donation.optInCharityEmail = this.personalAndMarketingGroup.value.optInCharityEmail;
      this.donation.optInTbgEmail = this.personalAndMarketingGroup.value.optInTbgEmail;

      if (this.donation.giftAid || this.donation.tipGiftAid) {
        this.donation.homePostcode = this.giftAidGroup.value.homePostcode;
        this.donation.homeAddress = this.giftAidGroup.value.homeAddress;
      } else {
        this.donation.homePostcode = undefined;
        this.donation.homeAddress = undefined;
      }
      this.donationService.updateLocalDonation(this.donation);

      if (this.campaign && this.donation.psp === 'stripe') {
        this.analyticsService.logCheckoutStep(event.selectedIndex, this.campaign, this.donation);
      }
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

    // This ensures `stepper.reset()` evalutes this to false and our usage
    // with this const helps to prevent `createDonation()` from being incorrectly triggered.
    const activelySelectedNext = (event.previouslySelectedStep.label === 'Your donation'
                                  && event.previouslySelectedStep.interacted === true);

    const invalidDonation = (this.donation === undefined || this.donation.status === 'Cancelled');

    const invalidPreviousDonation = (this.previousDonation === undefined || this.previousDonation.status === 'Cancelled');

    // Create a donation if user actively clicks 'next' from first step and
    // the current and previous donations are invalid.
    if (activelySelectedNext && invalidDonation && invalidPreviousDonation) {

      this.createDonation();

      if (this.psp === 'stripe') {
        this.card = await this.stripeService.getCard();
        if (this.card) {
          this.card.mount(this.cardInfo.nativeElement);
          this.card.addEventListener('change', this.cardHandler);
        }
      }

      return;
    }

    // Default billing postcode to home postcode when Gift Aid's being claimed and so it's set.
    if (event.previouslySelectedStep.label === 'Gift Aid' && this.giftAidGroup.value.giftAid) {
      this.paymentAndAgreementGroup.patchValue({
        billingPostcode: this.giftAidGroup.value.homePostcode,
      });
    }
  }

  onStripeCardChange(state: StripeElementChangeEvent) {
    this.stripeCardReady = state.complete;
    this.stripeError = state.error?.message;

    this.cd.detectChanges();
  }

  setAmount(amount: number) {
    // We need to keep this as a string for consistency with manual donor-input amounts,
    // so that `submit()` doesn't fall over trying to clean it of possible currency symbols.
    this.amountsGroup.patchValue({ donationAmount: amount.toString() });
  }

  async submit() {
    if (this.donationForm.invalid) {
      return;
    }

    this.submitting = true;
    this.enthuseError = undefined;
    this.donationUpdateError = false;

    // Can't proceed if campaign info not looked up yet or no usable PSP
    if (!this.campaign || !this.campaign.charity.id || !this.psp) {
      this.donationUpdateError = true;
      return;
    }

    this.donation.billingPostalAddress = this.paymentAndAgreementGroup.value.billingPostcode;
    this.donationService.updateLocalDonation(this.donation);

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
          this.redirectToEnthuse(donation);
          return;
        } else if (donation.psp === 'stripe') {
          if (this.campaign) {
            this.analyticsService.logCheckoutStep(4, this.campaign, donation); // 'Pay'.
          }
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
    if (!this.donation.clientSecret) {
      this.stripeError = 'Missing data from previous step – please refresh and try again';
      this.analyticsService.logError('stripe_pay_missing_secret', `Donation ID: ${this.donation.donationId}`);
      return;
    }

    const result = await this.stripeService.confirmCardPayment(
      this.donation.clientSecret,
      this.card,
      this.personalAndMarketingGroup.value.emailAddress,
      `${this.personalAndMarketingGroup.value.firstName} ${this.personalAndMarketingGroup.value.lastName}`,
      this.paymentAndAgreementGroup.value.billingPostcode,
    );

    if (result.error) {
      this.stripeError = result.error.message;
      this.analyticsService.logError('stripe_card_payment_error', result.error.message ?? '[No message]');

      return;
    }

    if (!result.paymentIntent) {
      this.analyticsService.logError('stripe_card_payment_invalid_response', 'No error or paymentIntent');
      return;
    }

    // See https://stripe.com/docs/payments/intents
    if (['succeeded', 'processing'].includes(result.paymentIntent.status)) {
      this.analyticsService.logEvent(
        'stripe_card_payment_success',
        `Stripe Intent processing or done for donation ${this.donation.donationId} to campaign ${this.campaignId}`,
      );
      if (this.campaign) {
        this.analyticsService.logCheckoutDone(this.campaign, this.donation);
      }
      this.router.navigate(['thanks', this.donation.donationId], {
        replaceUrl: true,
      });
    } else {
      this.analyticsService.logError('stripe_intent_not_success', result.paymentIntent.status);
      this.stripeError = `Status: ${result.paymentIntent.status}`;
    }

    this.submitting = false;
  }

  get donationAmountField() {
    if (!this.donationForm) {
      return undefined;
    }

    return this.donationForm.controls.amounts.get('donationAmount');
  }

  /**
   * Quick getter for donation amount, to keep template use concise.
   */
  get donationAmount(): number {
    return this.sanitiseCurrency(this.amountsGroup.value.donationAmount);
  }

  get donationAndTipAmount(): number {
    return this.donationAmount + this.tipAmount();
  }

  expectedMatchAmount(): number {
    if (!this.campaign) {
      return 0;
    }

    return Math.max(0, Math.min(this.campaign.matchFundsRemaining, parseFloat(this.amountsGroup.value.donationAmount)));
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

  /**
   * Unlike the CampaignService method which is more forgiving if the status gets stuck Active (we don't trust
   * these to be right in Salesforce yet), this check relies solely on campaign dates.
   */
  campaignIsOpen(): boolean {
    return (
      this.campaign
        ? (new Date(this.campaign.startDate) <= new Date() && new Date(this.campaign.endDate) > new Date())
        : false
      );
  }

  reservationExpiryTime(): Date | undefined {
    if (!this.donation?.createdTime || !this.donation.matchReservedAmount) {
      return undefined;
    }

    return new Date(environment.reservationMinutes * 60000 + (new Date(this.donation.createdTime)).getTime());
  }

  sanitiseCurrency(amount: string): number {
    return Number((amount || '0').replace('£', ''));
  }

  scrollTo(el: Element): void {
    if (el) {
       el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  next() {
    if (!this.goToFirstVisibleError()) {
      this.stepper.next();
    }
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

    const firstCustomError = document.querySelector('.error');
    if (firstCustomError) {
      this.scrollTo(firstCustomError);
      return true;
    }

    return false;
  }

  /**
   * Redirect if campaign's not open yet; set up page metadata if it is
   */
  private handleCampaign(campaign: Campaign) {
    if (environment.psps.stripe.enabled && this.campaign?.charity.stripeAccountId) {
      this.psp = 'stripe';
      this.addStripeValidators();
    } else if (environment.psps.enthuse.enabled) {
      this.psp = 'enthuse';
    } else {
      this.noPsps = true;
    }

    this.analyticsService.logCampaignChosen(campaign);

    if (!CampaignService.isOpenForDonations(campaign)) {
      this.router.navigateByUrl(`/campaign/${campaign.id}`, { replaceUrl: true });
      return;
    }

    this.pageMeta.setCommon(`Donate to ${campaign.charity.name}`, `Donate to the "${campaign.title}" campaign`, campaign.bannerUri);
  }

  private getSuggestedAmounts(): number[] {
    if (environment.suggestedAmounts.length === 0) {
      return [];
    }

    // Approach inspired by https://blobfolio.com/2019/10/randomizing-weighted-choices-in-javascript/
    let thresholdCounter = 0;
    for (const suggestedAmount of environment.suggestedAmounts) {
      thresholdCounter += suggestedAmount.weight;
    }
    const threshold = Math.floor(Math.random() * thresholdCounter);

    thresholdCounter = 0;
    for (const suggestedAmount of environment.suggestedAmounts) {
      thresholdCounter += suggestedAmount.weight;

      if (thresholdCounter > threshold) {
        return suggestedAmount.values;
      }
    }

    // We should never reach this point if the suggestions options are configured correctly.
    this.analyticsService.logError(
      'suggested_amounts_misconfigured',
      `Unexpectedly failed to pick suggested amounts for campaign ${this.campaignId}`,
    );

    return [];
  }

  private createDonation() {
    if (!this.campaign || !this.campaign.charity.id || !this.psp) {
      this.donationCreateError = true;
      return;
    }

    this.donationCreateError = false;

    const donation: Donation = {
      charityId: this.campaign.charity.id,
      charityName: this.campaign.charity.name,
      countryCode: 'GB',
      // Strip '£' if entered
      donationAmount: this.sanitiseCurrency(this.amountsGroup.value.donationAmount),
      donationMatched: this.campaign.isMatched,
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
    this.donationService
      .create(donation)
      .subscribe(async (response: DonationCreatedResponse) => {
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

        if (this.campaign && this.psp === 'stripe') {
          this.analyticsService.logCheckoutStep(1, this.campaign, this.donation);
        }

        // Amount reserved for matching is 'false-y', i.e. £0
        if (donation.donationMatched && !response.donation.matchReservedAmount) {
          this.promptToContinueWithNoMatchingLeft(response.donation);
          return;
        }

        // Amount reserved for matching is >£0 but less than the full donation
        if (donation.donationMatched && response.donation.matchReservedAmount < donation.donationAmount) {
          this.promptToContinueWithPartialMatching(response.donation);
          return;
        }
      }, response => {
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
      });
  }

  private offerExistingDonation(donation: Donation) {
    this.analyticsService.logEvent('existing_donation_offered', `Found pending donation to campaign ${this.campaignId}`);

    const reuseDialog = this.dialog.open(DonationStartOfferReuseDialogComponent, {
      data: { donation },
      disableClose: true,
      role: 'alertdialog',
    });
    reuseDialog.afterClosed().subscribe(this.getDialogResponseFn(donation));
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
      this.donationService.cancel(this.previousDonation).subscribe(() => this.donationService.removeLocalDonation(this.previousDonation));
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

  private redirectToEnthuse(donation: Donation) {
    this.analyticsService.logAmountChosen(donation.donationAmount, this.campaignId, this.suggestedAmounts);
    this.analyticsService.logEvent('payment_redirect_click', `Donating to campaign ${this.campaignId}`);
    this.charityCheckoutService.startDonation(donation);
  }

  private promptToContinueWithNoMatchingLeft(donation: Donation) {
    if (!this.campaign) {
      return;
    }

    this.analyticsService.logEvent('alerted_no_match_funds', `Asked donor whether to continue for campaign ${this.campaignId}`);
    this.promptToContinue(
      'Match funds not available',
      'There are no match funds currently available for this campaign so your donation will not be matched.',
      'Remember every penny helps & you can continue to make an unmatched donation to the charity!',
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
    if (!this.campaign) {
      return;
    }

    this.analyticsService.logEvent('alerted_partial_match_funds', `Asked donor whether to continue for campaign ${this.campaignId}`);
    const formattedReservedAmount = (new ExactCurrencyPipe()).transform(donation.matchReservedAmount);
    this.promptToContinue(
      'Not all match funds are available',
      'There are not enough match funds currently available to fully match your donation. ' +
        `${formattedReservedAmount} will be matched.`,
      'Remember every penny helps & you can continue to make a partially matched donation to the charity!',
      'Cancel and release match funds',
      donation,
      this.campaign.surplusDonationInfo,
    );
  }

  private addStripeValidators(): void {
    this.amountsGroup.controls.tipAmount.setValidators([
      Validators.required,
      Validators.pattern('^£?[0-9]+?(\\.[0-9]{2})?$'),
    ]);

    // Gift Aid home address fields are validated only in Stripe mode and also
    // conditionally on the donor claiming Gift Aid.
    this.giftAidGroup.get('giftAid')?.valueChanges.subscribe(giftAidChecked => {
      if (giftAidChecked) {
        this.giftAidGroup.controls.homePostcode.setValidators([
          Validators.required,
          Validators.pattern(this.postcodeRegExp),
        ]);
        this.giftAidGroup.controls.homeAddress.setValidators([
          Validators.required,
        ]);
      } else {
        this.giftAidGroup.controls.homePostcode.setValidators([]);
        this.giftAidGroup.controls.homeAddress.setValidators([]);
      }

      this.giftAidGroup.controls.homePostcode.updateValueAndValidity();
      this.giftAidGroup.controls.homeAddress.updateValueAndValidity();
    });

    this.personalAndMarketingGroup.controls.firstName.setValidators([
      Validators.required,
    ]);
    this.personalAndMarketingGroup.controls.lastName.setValidators([
      Validators.required,
    ]);
    this.personalAndMarketingGroup.controls.emailAddress.setValidators([
      Validators.required,
      Validators.email,
    ]);

    this.paymentAndAgreementGroup.controls.billingPostcode.setValidators([
      Validators.required,
      Validators.pattern(this.postcodeRegExp),
    ]);
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
   *     browser state and confirmed with the API that it is resumable, or
   * (b) after leaving step 1, having found that match funds will not cover
   *     the donation fully.
   */
  private getDialogResponseFn(donation: Donation) {
    return (proceed: boolean) => {
      if (proceed) {
        // Required for both use cases.
        this.donation = donation;

        // In doc block use case (a), we need to put the amounts from the previous
        // donation into the form and move to Step 2.
        this.amountsGroup.patchValue({
          donationAmount: donation.donationAmount.toString(),
          tipAmount: donation.tipAmount.toString(),
        });

        if (this.stepper.selected.label === 'Your donation') {
          this.stepper.next();
        }

        return;
      }

      // Else cancel the existing donation and remove our local record.
      this.donationService.cancel(donation)
        .subscribe(
          () => {
            this.analyticsService.logEvent('cancel', `Donor cancelled donation ${donation.donationId} to campaign ${this.campaignId}`),
            this.donationService.removeLocalDonation(donation);

            // Removes match funds reserved timer if present
            delete this.donation;

            // Go back to 1st step to encourage donor to try again
            this.stepper.reset();
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
}
