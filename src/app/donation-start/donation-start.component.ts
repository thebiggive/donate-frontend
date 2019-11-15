import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { retryWhen, tap  } from 'rxjs/operators';

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
import { PageMetaService } from '../page-meta.service';
import { retryStrategy } from '../observable-retry';

@Component({
  selector: 'app-donation-start',
  templateUrl: './donation-start.component.html',
  styleUrls: ['./donation-start.component.scss'],
})

export class DonationStartComponent implements OnInit {
  public campaign: Campaign;
  public donationForm: FormGroup;
  public retrying = false;
  public suggestedAmounts = [50, 200, 500];
  public sfApiError = false;              // Salesforce donation create API error
  public submitting = false;
  public validationError = false;         // Internal Angular app form validation error
  private campaignId: string;
  private charityCheckoutError?: string;  // Charity Checkout donation start error message
  private previousDonation?: Donation;

  constructor(
    private analyticsService: AnalyticsService,
    private campaignService: CampaignService,
    private charityCheckoutService: CharityCheckoutService,
    public dialog: MatDialog,
    private donationService: DonationService,
    private formBuilder: FormBuilder,
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
    route.queryParams.forEach((params: Params) => {
      if (params.error) {
        this.charityCheckoutError = params.error;
      }
    });
  }

  ngOnInit() {
    this.campaignService.getOneById(this.campaignId)
      .subscribe(campaign => {
        this.campaign = campaign;
        this.pageMeta.setCommon(`Donate to ${campaign.charity.name}`, `Donate to the "${campaign.title}" campaign`, campaign.bannerUri);
      });

    this.donationForm = this.formBuilder.group({
      donationAmount: [null, [
        Validators.required,
        Validators.min(5),
        Validators.max(environment.maximumDonationAmount),
        Validators.pattern('^£?[0-9]+?$'),
      ]],
      giftAid: [null, Validators.required],
      optInCharityEmail: [null, Validators.required],
      optInTbgEmail: [null, Validators.required],
    });

    this.donationService.getProbablyResumableDonation(this.campaignId)
      .subscribe((existingDonation: (Donation|undefined)) => {
        this.previousDonation = existingDonation;

        if (this.charityCheckoutError) {
          this.processDonationError();
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
        this.offerExistingDonation(this.previousDonation);
    });
  }

  setAmount(amount: number) {
    // We need to keep this as a string for consistency with manual donor-input amounts,
    // so that `submit()` doesn't fall over trying to clean it of possible currency symbols.
    const amountAsString = amount.toString();
    this.donationForm.patchValue({ donationAmount: amountAsString });
  }

  submit() {
    if (this.donationForm.invalid) {
      this.validationError = true;
      return;
    }

    this.submitting = true;
    this.charityCheckoutError = null;
    this.sfApiError = this.validationError = false;

    if (!this.campaign.charity.id) { // Can't proceed if campaign info not looked up yet
      this.sfApiError = true;
      return;
    }

    const donation = new Donation(
      this.campaign.charity.id,
      this.donationForm.value.donationAmount.replace('£', ''), // Strip '£' if entered
      this.campaign.isMatched,
      this.donationForm.value.giftAid,
      this.donationForm.value.optInCharityEmail,
      this.donationForm.value.optInTbgEmail,
      this.campaignId,
      undefined,
      this.campaign.charity.name,
    );

    this.donationService
      .create(donation) // Create Salesforce donation
      // excluding status code, delay for logging clarity
      .pipe(
        retryWhen(error => {
          return error.pipe(
            tap(val => this.retrying = (val.status !== 500)),
            retryStrategy({excludedStatusCodes: [500]}),
          );
        }),
      )
      .subscribe((response: DonationCreatedResponse) => {
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

        // Else either the donation was not expected to be matched or has 100% match funds allocated -> no need for an extra step
        this.redirectToCharityCheckout(response.donation);
      }, response => {
        let errorMessage: string;
        if (response.error) {
          errorMessage = `Could not create new donation for campaign ${this.campaignId}: ${response.error.error}`;
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

  /**
   * Quick getter for form controls, to keep validation message handling concise.
   */
  get f() { return this.donationForm.controls; }

  expectedMatchAmount(): number {
    return Math.min(this.campaign.matchFundsRemaining, parseFloat(this.donationForm.value.donationAmount));
  }

  giftAidAmount(): number {
    return this.donationForm.value.giftAid ? (0.25 * parseFloat(this.donationForm.value.donationAmount)) : 0;
  }

  expectedTotalAmount(): number {
    return parseFloat(this.donationForm.value.donationAmount) + this.giftAidAmount() + this.expectedMatchAmount();
  }

  campaignIsOpen(): boolean {
    return (
      this.campaign
        ? (new Date(this.campaign.startDate) <= new Date() && new Date(this.campaign.endDate) > new Date())
        : false
      );
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
    this.analyticsService.logEvent('payment_redirect_click', `Donating to campaign ${this.campaignId}`);
    this.charityCheckoutService.startDonation(donation);
  }

  private promptToContinueWithNoMatchingLeft(donation: Donation) {
    this.analyticsService.logEvent('alerted_no_match_funds', `Asked donor whether to continue for campaign ${this.campaignId}`);
    this.promptToContinue(
      'There are no match funds remaining for this campaign. Your donation will not be matched.',
      'Cancel',
      donation,
    );
  }

  /**
   * @param donation *Response* Donation object, with `matchReservedAmount` set and returned by Salesforce.
   */
  private promptToContinueWithPartialMatching(donation: Donation) {
    this.analyticsService.logEvent('alerted_partial_match_funds', `Asked donor whether to continue for campaign ${this.campaignId}`);
    this.promptToContinue(
      `There are limited match funds remaining for this campaign. £${donation.matchReservedAmount} of your donation will be matched.`,
      'Cancel and release match funds',
      donation,
    );
  }

  private promptToContinue(status: string, cancelCopy: string, donation: Donation) {
    const continueDialog = this.dialog.open(DonationStartMatchConfirmDialogComponent, {
      data: { cancelCopy, status },
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
