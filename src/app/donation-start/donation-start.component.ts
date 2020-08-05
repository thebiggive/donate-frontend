import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

export class DonationStartComponent implements OnDestroy, OnInit {
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

  private campaignId: string;
  private enthuseError?: string;  // Enthuse donation start error message
  private previousDonation?: Donation;

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

  async stepChanged(event: StepperSelectionEvent) {
    if (event.previouslySelectedStep.label === 'Your donation') {
      this.createDonation();

      if (this.psp === 'stripe') {
        this.card = await this.stripeService.createCard();
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
    this.donation.emailAddress = this.personalAndMarketingGroup.value.emailAddress;
    this.donation.firstName = this.personalAndMarketingGroup.value.firstName;
    this.donation.giftAid = this.giftAidGroup.value.giftAid;
    this.donation.lastName = this.personalAndMarketingGroup.value.lastName;
    this.donation.optInCharityEmail = this.personalAndMarketingGroup.value.optInCharityEmail;
    this.donation.optInTbgEmail = this.personalAndMarketingGroup.value.optInTbgEmail;

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
    return Number((this.amountsGroup.value.donationAmount || '0').replace('£', ''));
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
    return Number((this.amountsGroup.value.tipAmount || '0').replace('£', ''));
  }

  expectedTbgAmount(): number {
    return this.tipAmount() + (this.giftAidGroup.value.giftAid ? (0.25 * this.tipAmount()) : 0);
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
      donationAmount: this.amountsGroup.value.donationAmount.replace('£', ''),
      donationMatched: this.campaign.isMatched,
      giftAid: this.giftAidGroup.value.giftAid,
      matchedAmount: 0, // Only set >0 after donation completed
      matchReservedAmount: 0, // Only set >0 after initial donation create API response
      projectId: this.campaignId,
      psp: this.psp,
      tipAmount: this.amountsGroup.value.tipAmount,
    };

    this.donationService
      .create(donation)
      // excluding status code, delay for logging clarity
      .pipe(
        retryWhen(createError => {
          return createError.pipe(
            retryStrategy({excludedStatusCodes: [500]}),
          );
        }),
      )
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
   * Thunk returning a fn which can handle a dialog true/false response and continue/cancel `donation` accordingly.
   */
  private getDialogResponseFn(donation: Donation) {
    return (proceed: boolean) => {
      if (proceed) {
        // Create has already set up the Donation with no/partial matching, and the donor is
        // already on step 2. So there is nothing to do but let them continue in this case.
        return;
      }

      // Else cancel the existing donation, remove our local record and return to step 1,
      // clearing amounts to encourage smaller donations in the partial match case.
      this.donationService.cancel(donation)
        .subscribe(
          () => {
            this.analyticsService.logEvent('cancel', `Donor cancelled donation ${donation.donationId} to campaign ${this.campaignId}`),
            this.donationService.removeLocalDonation(donation);
            this.stepper.reset(); // Clear form and return to step 1.
          },
          response => {
            this.analyticsService.logError(
              'cancel_failed',
              `Could not cancel donation ${donation.donationId} to campaign ${this.campaignId}: ${response.error.error}`,
            );
            this.stepper.reset(); // Clear and return to start even if the first attempt is 'stuck'.
          },
        );
    };
  }
}
