import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Donation } from '../donation.model';
import { DonationService } from '../donation.service';

@Component({
  selector: 'app-donation-complete',
  templateUrl: './donation-complete.component.html',
  styleUrls: ['./donation-complete.component.scss'],
})
export class DonationCompleteComponent implements OnInit {
  public complete = false;
  public donation: Donation;
  public noAccess = false;
  public timedOut = false;

  private donationId: string;
  private maxTries = 5;
  private retryInterval = 2; // In seconds
  private tries = 0;

  constructor(
    private donationService: DonationService,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => this.donationId = params.donationId);
  }

  ngOnInit() {
    this.checkDonation();
  }

  /**
   * Must be public in order for re-tries to invoke it in an anonymous context.
   */
  checkDonation(): Observable<Donation> {
    const donationLocalCopy = this.donationService.getDonation(this.donationId);

    if (donationLocalCopy === undefined) {
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    this.donationService.get(donationLocalCopy).subscribe(donation => this.setDonation(donation));
  }

  private setDonation(donation: Donation) {
    this.donation = donation;

    if (donation === undefined) {
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    this.tries++;

    if (this.donationService.isComplete(donation)) {
      this.complete = true;
      return;
    }

    if (this.tries < this.maxTries) {
      // Use an anonymous function so `this` context works inside the callback.
      setTimeout(() => this.checkDonation(), this.retryInterval * 1000);
      return;
    }

    this.timedOut = true;
  }
}
