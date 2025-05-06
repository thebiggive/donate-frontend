import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { MatomoTracker } from 'ngx-matomo-client';

import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { Credentials } from '../credentials.model';
import { Donation, isLargeDonation } from '../donation.model';
import { DonationService } from '../donation.service';
import { environment } from '../../environments/environment';
import { minPasswordLength } from '../../environments/common';
import { IdentityService } from '../identity.service';
import { PageMetaService } from '../page-meta.service';
import { Person } from '../person.model';
import { myAccountPath } from '../app-routing';
import { flags } from '../featureFlags';
import { WidgetInstance } from 'friendly-challenge';
import { GIFT_AID_FACTOR } from '../Money';

@Component({
  selector: 'app-donation-thanks',
  templateUrl: './donation-thanks.component.html',
  styleUrl: './donation-thanks.component.scss',

  // predates use of standalone
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class DonationThanksComponent implements OnInit {
  @Input({ required: true }) private donationId!: string;

  campaign?: Campaign;
  totalPaid?: number;
  complete = false;
  donation?: Donation;
  encodedShareUrl?: string;
  giftAidAmount?: number;
  loggedIn = false;
  minPasswordLength!: number;
  noAccess = false;
  encodedPrefilledText?: string;
  registerError?: string;
  registerErrorDescription?: string = undefined;
  registerErrorDescriptionHtml?: SafeHtml = undefined;
  registrationComplete = false;
  timedOut = false;
  totalValue?: number;
  donationIsLarge: boolean = false;
  private readonly maxTries = 5;
  private patchedCorePersonInfo = false;
  private person?: Person;
  private readonly retryBaseIntervalSeconds = 2;
  private tries = 0;
  protected readonly myAccountPath = myAccountPath;
  protected readonly flags = flags;
  protected readonly friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;

  @ViewChild('frccaptcha', { static: false })
  protected friendlyCaptcha!: ElementRef<HTMLElement>;
  private friendlyCaptchaWidget: WidgetInstance | undefined;
  private friendlyCaptchaSolution: string | undefined;

  faExclamationTriangle = faExclamationTriangle;
  isDataLoaded = false;

  constructor(
    private campaignService: CampaignService,
    public dialog: MatDialog,
    private donationService: DonationService,
    private identityService: IdentityService,
    private matomoTracker: MatomoTracker,
    private pageMeta: PageMetaService,
    private sanitizer: DomSanitizer,
  ) {
    this.minPasswordLength = minPasswordLength;
  }

  ngOnInit() {
    this.checkDonation();
    this.loadPerson();
  }

  private loadPerson = () => {
    this.identityService.getPerson({ refresh: true }).subscribe((person: Person | null) => {
      this.loggedIn = !!person && !!person.has_password;

      if (person) {
        this.person = person;
      }

      this.isDataLoaded = true;
    });
  };

  /**
   * Must be public in order for re-tries to invoke it in an anonymous context.
   */
  checkDonation(): void {
    this.donationService.removeOldLocalDonations();

    this.tries++;
    const donationLocalCopy = this.donationService.getDonation(this.donationId);

    if (donationLocalCopy === undefined) {
      this.matomoTracker.trackEvent('donate', 'thank_you_no_local_copy', `Donation ID ${this.donationId}`);
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    this.donationService.get(donationLocalCopy).subscribe(
      (donation) => this.setDonation(donation),
      // Get error may occur e.g. after a DB reset; unlikely recoverable within the
      // page view so treat it like a timeout. Error message encourages donors to
      // refresh to try loading again when any server problem's resolved.
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.noAccess = true;
        } else {
          this.timedOut = true;
        }
      },
    );
  }

  /**
   * Returns undefined in case the person is not yet loaded from the backend so we don't know
   * what their balance is. Compare exactly to false to see if they have a zero balance.
   */
  protected get hasDonationFunds() {
    const cashBalance = this.person?.cash_balance;

    if (cashBalance === undefined) {
      return undefined;
    }

    const gbpCashBalance = cashBalance.gbp;

    if (gbpCashBalance === undefined) {
      return false; // stripe doesn't show us a zero balance.
    }

    return gbpCashBalance > 0;
  }

  protected get showNoFundsRemainingMessage(): boolean {
    return this.donation?.pspMethodType === 'customer_balance' && this.hasDonationFunds === false;
  }

  protected get cashBalanceInPounds(): number {
    return (this.person?.cash_balance?.gbp || 0) / 100;
  }

  login() {
    if (!this.friendlyCaptchaSolution) {
      // This is expected after ~1 min when the code expires. At this point we should
      // never be executing the login again because if the captcha was set up at all then
      // we auto-logged-in with the password the donor just chose.
      return;
    }

    const credentials: Credentials = {
      email_address: this.donation?.emailAddress as string,
      raw_password: this.person?.raw_password as string,
      captcha_code: this.friendlyCaptchaSolution,
    };

    this.identityService.login(credentials).subscribe({
      next: (_response) => {
        // It's still the same person, just an upgraded / "complete" token. So for now just recycle the ID. We'll probably improve
        // `/auth` to return the ID separately soon, so we can do a normal login form that's able to call this without
        // having to decode the JWT (though maybe that's a good thing for the frontend to be able to do anyway?).
        // For now, keep console logging these even live, because the app
        // gives no visual indication that a longer-term token's been
        // set up yet.
        console.log('Upgraded local token to a long-lived one with more permissions');
      },
      error: (error: HttpErrorResponse) => {
        this.matomoTracker.trackEvent('identity_error', 'login_failed', `${error.status}: ${error.message}`);
      },
    });
  }

  private setDonation(donation: Donation) {
    if (donation === undefined || !donation.firstName || !donation.lastName || !donation.emailAddress) {
      this.matomoTracker.trackEvent('donate', 'thank_you_lookup_failed', `Donation ID ${this.donationId}`);
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    this.donation = donation;
    this.campaignService.getOneById(donation.projectId).subscribe((campaign) => {
      this.campaign = campaign;
      this.pageMeta.setCommon(`Thank you for donating to the "${campaign.title}" campaign`, ``, campaign.bannerUri);
      this.setSocialShares(campaign);
    });

    if (donation && this.donationService.isComplete(donation)) {
      // This is linked to the Donation Complete goal in Matomo, so we don't need to separately
      // `trackGoal()` for that.
      // See also `ConversionTrackingService.convert()` which is called just before
      // redirect here, usually at most once per donation.
      this.matomoTracker.trackEvent(
        'donate',
        'thank_you_fully_loaded',
        `Donation to campaign ${donation.projectId}`,
        donation.donationAmount,
      );

      this.totalPaid = donation.totalPaid;
      this.giftAidAmount = donation.giftAid ? GIFT_AID_FACTOR * donation.donationAmount : 0;
      this.totalValue = donation.donationAmount + this.giftAidAmount + donation.matchedAmount;
      this.donationIsLarge = isLargeDonation(donation);
      this.complete = true;

      // Re-save the donation with its new status so we don't offer to resume it if the donor
      // goes back to the same campaign.
      this.donationService.updateLocalDonation(donation);

      if (donation.pspMethodType === 'customer_balance') {
        // the donation will have affected the person's customer balance so wait to re-load the person before updating it:
        const oneSecond = 1_000;
        setTimeout(this.loadPerson, oneSecond);
      } else {
        this.loadPerson();
      }

      return;
    }

    if (this.tries <= this.maxTries) {
      // Use an anonymous function so `this` context works inside the callback.

      setTimeout(
        () => this.checkDonation(),
        // Exponential back-off from e.g. 2s to 32s.
        this.calculateExponentialBackoffMs(this.tries),
      );
      return;
    }

    this.matomoTracker.trackEvent(
      'donate',
      'thank_you_timed_out_pre_complete',
      `Donation to campaign ${donation.projectId}`,
    );
    this.timedOut = true;
  }

  calculateExponentialBackoffMs(tries: number) {
    return this.retryBaseIntervalSeconds * 1000 * 2 ** tries;
  }

  private setSocialShares(campaign: Campaign) {
    const prefix = environment.donateUriPrefix;
    this.encodedShareUrl = encodeURIComponent(`${prefix}/campaign/${campaign.id}`);
    this.encodedPrefilledText = encodeURIComponent(
      'I just donated to this campaign, please support their good cause by making a donation.',
    );
  }
}
