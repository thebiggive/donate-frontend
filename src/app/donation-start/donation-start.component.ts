import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';

import { Campaign } from './../campaign.model';
import { CharityCheckoutService } from '../charity-checkout.service';
import { CampaignService } from '../campaign.service';
import { Donation } from '../donation.model';
import { DonationCreatedResponse } from '../donation-created-response.model';
import { DonationService } from '../donation.service';
import { DonationStartMatchConfirmDialogComponent } from './donation-start-match-confirm-dialog.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-donation-start',
  templateUrl: './donation-start.component.html',
  styleUrls: ['./donation-start.component.scss'],
})
export class DonationStartComponent implements OnInit {
  public campaign: Campaign;
  public charityCheckoutError?: string; // Charity Checkout donation start error message
  public donationForm: FormGroup;
  public sfApiError = false;              // Salesforce donation create API error
  public submitting = false;
  public validationError = false;         // Internal Angular app form validation error

  private campaignId: string;

  constructor(
    private campaignService: CampaignService,
    private charityCheckoutService: CharityCheckoutService,
    public dialog: MatDialog,
    private donationService: DonationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
    route.queryParams.forEach((params: Params) => {
      if (params.error) {
        this.charityCheckoutError = params.error;
      }
    });
  }

  ngOnInit() {
    this.campaignService.getOne(this.campaignId)
      .subscribe(campaign => this.campaign = campaign);

    this.donationForm = this.formBuilder.group({
      // TODO require a whole number of pounds, unless scrapping that constraint
      donationAmount: [null, [
        Validators.required,
        Validators.min(5),
        Validators.max(environment.maximumDonationAmount),
        Validators.pattern('^£?[0-9]+(\\.[0-9]{2})?$'),
      ]],
      giftAid: [null, Validators.required],
      optInCharityEmail: [null, Validators.required],
      optInTbgEmail: [null, Validators.required],
    });
  }

  public submit() {
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
      .subscribe((donationCreatedResponse: DonationCreatedResponse) => {
        // If that succeeded proceed to Charity Checkout donation page, providing key
        // fields are present in the Salesforce response's Donation.

        const salesforceResponseMissingRequiredData = (
          !donationCreatedResponse.donation.charityId ||
          !donationCreatedResponse.donation.donationId ||
          !donationCreatedResponse.donation.projectId
        );
        if (salesforceResponseMissingRequiredData) {
          // TODO log detail of missing info back from Salesforce
          this.sfApiError = true;
          this.submitting = false;

          return;
        }

        if (donation.donationMatched && !donationCreatedResponse.donation.donationMatched) {
          this.promptToContinueWithNoMatchingLeft(donationCreatedResponse.donation);
          return;
        }

        if (donation.donationMatched && donation.donationAmount < donationCreatedResponse.donation.matchReservedAmount) {
          this.promptToContinueWithPartialMatching(donationCreatedResponse.donation);
          return;
        }

        // Else either the donation was not expected to be matched or has 100% match funds allocated -> no need for an extra step
        this.redirectToCharityCheckout(donationCreatedResponse.donation);
      }, error => {
        // TODO log the detailed `error` message somewhere
        this.sfApiError = true;
        this.submitting = false;

        // TEMPORARY logic to proceed to Charity Checkout even though SF create failed
        // Un-comment for testing while we're ironing out the donation create API
        // TODO remove this entirely
        // this.charityCheckoutService.startDonation(donation);

        console.log('ERROR', error);
      });
  }

  /**
   * Quick getter for form controls, to keep validation message handling concise.
   */
  get f() { return this.donationForm.controls; }

  private redirectToCharityCheckout(donation: Donation) {
    this.charityCheckoutService.startDonation(donation);
  }

  private promptToContinueWithNoMatchingLeft(donation: Donation) {
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
    this.promptToContinue(
      `There are limited match funds remaining for this campaign. £${donation.matchReservedAmount} of your donation will be matched.`,
      'Cancel and release match funds',
      donation,
    );
  }

  private promptToContinue(status: string, cancelCopy: string, donation: Donation) {
    const dialogRef = this.dialog.open(DonationStartMatchConfirmDialogComponent, {
      data: { cancelCopy, status },
      disableClose: true,
      role: 'alertdialog',
    });

    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        this.redirectToCharityCheckout(donation);

        return;
      }

      // Else cancel the pending donation
      // TODO release match funds reserved, if any - DON-12

      this.submitting = false;
    });
  }
}
