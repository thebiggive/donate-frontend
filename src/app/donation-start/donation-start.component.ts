import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CharityCheckoutService } from '../charity-checkout.service';
import { Donation } from '../donation.model';
import { DonationCreatedResponse } from '../donation-created-response.model';
import { DonationService } from '../donation.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-donation-start',
  templateUrl: './donation-start.component.html',
  styleUrls: ['./donation-start.component.scss'],
})
export class DonationStartComponent implements OnInit {
  public apiError = false;
  public campaignId: string;
  public donationForm: FormGroup;
  public submitting = false;
  public validationError = false;

  constructor(
    private charityCheckoutService: CharityCheckoutService,
    private donationService: DonationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
  }

  ngOnInit() {
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
    console.log(this.donationForm.value);

    if (this.donationForm.invalid) {
      this.validationError = true;
      return;
    }

    this.submitting = true;
    this.apiError = this.validationError = false;

    const donation = new Donation(
      '0011r00002HHAphAAH', // TODO derive from the campaign once we look up campaign details
      this.donationForm.value.donationAmount.replace('£', ''), // Strip '£' if entered
      false, // TODO set appropriately once we look up campaign details
      this.donationForm.value.giftAid,
      this.donationForm.value.optInCharityEmail,
      this.donationForm.value.optInTbgEmail,
      this.campaignId,
      undefined,
      'People, Potential, Possibilities',
    );

    this.donationService
      .create(donation) // Create Salesforce donation
      .subscribe((donationCreatedResponse: DonationCreatedResponse) => {
        // If that succeeded, proceed to Charity Checkout donation page
        this.charityCheckoutService.startDonation(donationCreatedResponse.donation);
      }, error => {
        // TODO log the detailed `error` message somewhere
        this.apiError = true;
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
  public get f() { return this.donationForm.controls; }
}
