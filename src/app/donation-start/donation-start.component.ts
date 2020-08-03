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

  donationForm: FormGroup;
  amountsGroup: FormGroup;
  giftAidGroup: FormGroup;
  personalAndMarketingGroup: FormGroup;
  paymentAndAgreementGroup: FormGroup;

  maximumDonationAmount: number;
  noPsps = false;
  psp?: 'enthuse' | 'stripe';
  retrying = false;
  suggestedAmounts?: number[];
  sfApiError = false;              // Salesforce donation create API error
  stripeProcessingError?: string;
  stripeValidationError?: string | undefined = 'Card not entered yet';
  submitting = false;

  private campaignId: string;
  private charityCheckoutError?: string;  // Charity Checkout donation start error message
  private donationClientSecret?: string; // Used in Stripe payment callback
  private donationId?: string; // Used in Stripe payment callback
  private previousDonation?: Donation;

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
        this.charityCheckoutError = params.error;
      }
    });
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
    delete this.donationClientSecret;
    delete this.donationId;
  }

  ngOnInit() {
    if (environment.psps.stripe.enabled) {
      this.psp = 'stripe';
    } else if (environment.psps.enthuse.enabled) {
      this.psp = 'enthuse';
    } else {
      this.noPsps = true;
    }

    this.donationForm = this.formBuilder.group({
      // Matching reservation happens at the end of this group.
      amounts: this.formBuilder.group({
        donationAmount: [null, [
          Validators.required,
          ValidateCurrencyMin,
          ValidateCurrencyMax,
          Validators.pattern('^£?[0-9]+?(\\.00)?$'),
        ]],
        tipAmount: [null, [
          // Validators.required, // TODO require iff in Stripe mode
          Validators.pattern('^£?[0-9]+?(\\.[0-9]{2})?$'),
        ]],
      }),
      giftAid: this.formBuilder.group({
        giftAid: [null, Validators.required],
        homeAddress: [null],  // Required iff Gift Aid claimed
        homePostcode: [null], // Required iff Gift Aid claimed
      }),
      personalAndMarketing: this.formBuilder.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        emailAddress: [null, [Validators.required, Validators.email]],
        optInCharityEmail: [null, Validators.required],
        optInTbgEmail: [null, Validators.required],
      }),
      // T&Cs agreement is implicit through submitting the form.
      paymentAndAgreement: this.formBuilder.group({
        billingPostcode: [null, Validators.required], // TODO validate format basics
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

    this.maximumDonationAmount = environment.maximumDonationAmount;
    const suggestedAmountsKey = makeStateKey<number[]>('suggested-amounts');
    this.suggestedAmounts = this.state.get(suggestedAmountsKey, undefined);
    if (this.suggestedAmounts === undefined) {
      this.suggestedAmounts = this.getSuggestedAmounts();
      this.state.set(suggestedAmountsKey, this.suggestedAmounts);
    }

    const campaignKey = makeStateKey<Campaign>(`campaign-${this.campaignId}`);
    this.campaign = this.state.get(campaignKey, undefined);

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

        if (this.charityCheckoutError) {
          this.processDonationError(); // TODO make this Enthuse specific or pass in the PSP name for GA event labels?
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

  onStripeCardChange(state: StripeElementChangeEvent) {
    if (state.complete) {
      this.stripeValidationError = undefined;
    } else {
      this.stripeValidationError = state.error ? state.error?.message : 'Valid so far but incomplete';
    }

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
    this.charityCheckoutError = undefined;
    this.sfApiError = false;

     // Can't proceed if campaign info not looked up yet or no usable PSP
    if (!this.campaign || !this.campaign.charity.id || !this.psp) {
      this.sfApiError = true;
      return;
    }

    const donation: Donation = {
      charityId: this.campaign.charity.id,
      charityName: this.campaign.charity.name,
      // Strip '£', '.00' if entered
      donationAmount: this.amountsGroup.value.donationAmount.replace('£', '').replace('.00', ''),
      donationMatched: this.campaign.isMatched,
      giftAid: this.giftAidGroup.value.giftAid,
      matchedAmount: 0, // Only set >0 after donation completed
      matchReservedAmount: 0, // Only set >0 after initial donation create API response
      optInCharityEmail: this.personalAndMarketingGroup.value.optInCharityEmail,
      optInTbgEmail: this.personalAndMarketingGroup.value.optInTbgEmail,
      projectId: this.campaignId,
      psp: this.psp,
      tipAmount: 0, // Only set >0 after donation completed
    };

    this.donationService
      .create(donation) // Create Donation record
      // excluding status code, delay for logging clarity
      .pipe(
        retryWhen(createError => {
          return createError.pipe(
            tap(val => this.retrying = (val.status !== 500)),
            retryStrategy({excludedStatusCodes: [500]}),
          );
        }),
      )
      .subscribe(async (response: DonationCreatedResponse) => {
        this.donationService.saveDonation(response.donation, response.jwt);

        // If that succeeded proceed to Charity Checkout donation page, providing key
        // fields are present in the Salesforce response's Donation.
        const salesforceResponseMissingRequiredData = (
          !response.donation.charityId ||
          !response.donation.donationId ||
          !response.donation.projectId
        );
        if (salesforceResponseMissingRequiredData) {
          this.analyticsService.logError(
            'salesforce_create_response_incomplete',
            `Missing expected response data creating new donation for campaign ${this.campaignId}`,
          );
          this.sfApiError = true;
          this.submitting = false;

          return;
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

        if (donation.psp === 'enthuse') {
          // Else either the donation was not expected to be matched or has 100% match funds allocated -> no need for an extra step
          this.redirectToCharityCheckout(response.donation);
          return;
        }

        // Else we're using Stripe and should prompt for payment details here.
        if (response.donation.clientSecret) {
          this.donationClientSecret = response.donation.clientSecret;
          this.donationId = response.donation.donationId;

          this.stepper.next();

          this.card = await this.stripeService.createCard();
          if (this.card) {
            this.card.mount(this.cardInfo.nativeElement);
            this.card.addEventListener('change', this.cardHandler);
          }
        } else {
          this.stripeProcessingError = 'Could not prepare payment';
          this.analyticsService.logError('stripe_payment_intent_create_failed', 'No client secret');
        }
        this.submitting = false;
      }, response => {
        let errorMessage: string;
        if (response.message) {
          errorMessage = `Could not create new donation for campaign ${this.campaignId}: ${response.message}`;
        } else {
          // Unhandled 5xx crashes etc.
          errorMessage = `Could not create new donation for campaign ${this.campaignId}: HTTP code ${response.status}`;
        }
        this.analyticsService.logError('salesforce_create_failed', errorMessage);
        this.retrying = false;
        this.sfApiError = true;
        this.submitting = false;
      });
  }

  async payWithStripe() {
    if (!this.donationClientSecret || !this.donationId) {
      this.stripeProcessingError = 'Missing data from previous step – please refresh and try again';
      this.analyticsService.logError('stripe_pay_missing_keys', `Donation ID: ${this.donationId}`);
      return;
    }

    this.submitting = true;

    const result = await this.stripeService.confirmCardPayment(
      this.donationClientSecret,
      this.card,
      this.personalAndMarketingGroup.value.emailAddress,
      `${this.personalAndMarketingGroup.value.firstName} ${this.personalAndMarketingGroup.value.lastName}`,
      this.paymentAndAgreementGroup.value.billingPostcode,
    );

    if (result.error) {
      this.stripeProcessingError = result.error.message;
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
        `Stripe Intent processing or done for donation ${this.donationId} to campaign ${this.campaignId}`,
      );
      this.router.navigate(['thanks', this.donationId], {
        replaceUrl: true,
      });
    } else {
      this.analyticsService.logError('stripe_intent_not_success', result.paymentIntent.status);
      this.stripeProcessingError = `Status: ${result.paymentIntent.status}`;
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
    return this.amountsGroup.value.donationAmount;
  }

  get donationAndTipAmount(): number {
    return Number(this.amountsGroup.value.donationAmount) + Number(this.amountsGroup.value.tipAmount);
  }

  expectedMatchAmount(): number {
    if (!this.campaign) {
      return 0;
    }

    return Math.max(0, Math.min(this.campaign.matchFundsRemaining, parseFloat(this.amountsGroup.value.donationAmount)));
  }

  giftAidAmount(): number {
    return this.giftAidGroup.value.giftAid ? (0.25 * parseFloat(this.amountsGroup.value.donationAmount)) : 0;
  }

  expectedTotalAmount(): number {
    return parseFloat(this.amountsGroup.value.donationAmount) + this.giftAidAmount() + this.expectedMatchAmount();
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

  private offerExistingDonation(donation: Donation) {
    this.submitting = true;
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
  private processDonationError() {
    this.analyticsService.logError(
      'charity_checkout_error',
      `Charity Checkout rejected donation setup for campaign ${this.campaignId}: ${this.charityCheckoutError}`,
    );

    if (this.previousDonation) {
      this.analyticsService.logEvent(
        'cancel_auto',
        `Cancelled failing donation ${this.previousDonation.donationId} to campaign ${this.campaignId}`,
      );
      this.donationService.cancel(this.previousDonation).subscribe(() => this.donationService.removeLocalDonation(this.previousDonation));
    }

    const errorDialog = this.dialog.open(DonationStartErrorDialogComponent, {
      data: { charityCheckoutError: this.charityCheckoutError },
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

  private redirectToCharityCheckout(donation: Donation) {
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
   * @param donation *Response* Donation object, with `matchReservedAmount` set and returned by Salesforce.
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
        // TODO this and similar need to support Stripe model too; abstract out
        // to a `continue()` method?
        this.redirectToCharityCheckout(donation);

        return;
      }

      // Else cancel the existing donation in Salesforce and remove our local record of it
      this.donationService.cancel(donation)
        .subscribe(
          () => {
            this.analyticsService.logEvent('cancel', `Donor cancelled donation ${donation.donationId} to campaign ${this.campaignId}`),
            this.donationService.removeLocalDonation(donation);
          },
          response => this.analyticsService.logError(
            'cancel_failed',
            `Could not cancel donation ${donation.donationId} to campaign ${this.campaignId}: ${response.error.error}`,
          ),
        );
      this.submitting = false;
    };
  }
}
