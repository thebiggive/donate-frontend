import { HttpErrorResponse } from '@angular/common/http';
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {MatomoTracker} from 'ngx-matomo-client';

import {Campaign} from '../campaign.model';
import {CampaignService} from '../campaign.service';
import {Credentials} from '../credentials.model';
import {Donation, isLargeDonation} from '../donation.model';
import {DonationThanksSetPasswordDialogComponent} from './donation-thanks-set-password-dialog.component';
import {DonationService} from '../donation.service';
import {environment} from '../../environments/environment';
import {minPasswordLength} from '../../environments/common';
import {IdentityService} from '../identity.service';
import {PageMetaService} from '../page-meta.service';
import {Person} from '../person.model';
import {myAccountPath} from '../app-routing';
import {flags} from "../featureFlags";
import {WidgetInstance} from "friendly-challenge";

@Component({
    selector: 'app-donation-thanks',
    templateUrl: './donation-thanks.component.html',
    styleUrl: './donation-thanks.component.scss',
    standalone: false
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
    this.identityService.getPerson({refresh: true}).subscribe((person: Person | null) => {
      this.loggedIn = !!person && !!person.has_password;

      if (person) {
        this.person = person;
      }

      this.isDataLoaded = true;
    });
  };

  protected get showRegistrationPrompt(): boolean
  {
    return !this.registrationComplete &&  // if they already registered they can't register again.
      !this.loggedIn && // if they registered and logged in they can't register again
      !!this.person // if we don't know who they are any more they can't register.
                    // This is likely because they already registered but selected "don't log in",
                    // then refreshed the page.
  }


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
      donation => this.setDonation(donation),
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
  protected get hasDonationFunds()
  {
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

  protected get showNoFundsRemainingMessage(): boolean
  {
    return this.donation?.pspMethodType === 'customer_balance' && this.hasDonationFunds === false
  }

  protected get cashBalanceInPounds(): number
  {
    return  (this.person?.cash_balance?.gbp || 0) / 100;
  }

  async openSetPasswordDialog() {
    const passwordSetDialog = this.dialog.open(DonationThanksSetPasswordDialogComponent, {
      data: { person: this.person },
    });
    passwordSetDialog.afterClosed().subscribe((data: {password?: string, stayLoggedIn?: boolean}) => {
      if (data.password) {
        this.setPassword(data.password, data.stayLoggedIn || false);
      }
    });

    if (! this.friendlyCaptchaWidget) {
      this.friendlyCaptchaWidget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
        doneCallback: (solution) => {
          this.friendlyCaptchaSolution = solution;
        },
        errorCallback: () => {
        },
      });

      await this.friendlyCaptchaWidget.start()
    }
  }

  login() {
    if (! this.friendlyCaptchaSolution) {
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
      next: _response => {
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

  private setPassword(password: string, stayLoggedIn: boolean) {
    if (!this.person) {
      this.matomoTracker.trackEvent('identity_error', 'person_password_set_missing_data', 'No person in component');
      this.registerError = 'Cannot set password without a person';
      return;
    }

    this.person.raw_password = password;
    this.identityService.update(this.person).subscribe({
      next: () => { // Success. Must subscribe for call to fire.
        this.registerError = undefined;
        this.registrationComplete = true;
        this.matomoTracker.trackEvent('identity', 'person_password_set', 'Account password creation complete');

        // We should only auto-login (and therefore execute the captcha) if the donor requested a persistent session.
        if (stayLoggedIn) {
          this.login()
        } else {
          // Otherwise we should remove even the temporary ID token.
          this.identityService.logout();
        }
      },
      error: async (error: HttpErrorResponse) => {
        const htmlErrorDescription = error.error?.error?.htmlDescription as string|undefined;
        if (error.error?.error?.type === "DUPLICATE_EMAIL_ADDRESS_WITH_PASSWORD") {
          this.registerErrorDescription = "Your password could not be set. There is already a password set for your email address.";
        } else if (htmlErrorDescription) {
          // we bypass security because we trust the Identity server.
          this.registerErrorDescriptionHtml = this.sanitizer.bypassSecurityTrustHtml(htmlErrorDescription)
        } else {
          this.registerErrorDescription = error.error?.error?.description
        }

        this.registerError = error.message;
        this.matomoTracker.trackEvent('identity_error', 'person_password_set_failed', `${error.status}: ${error.message}`);
        this.friendlyCaptchaWidget?.reset();
        await this.friendlyCaptchaWidget?.start();
      },
    });
  }

  private setDonation(donation: Donation) {
    if (donation === undefined || !donation.firstName || !donation.lastName || !donation.emailAddress) {
      this.matomoTracker.trackEvent('donate', 'thank_you_lookup_failed', `Donation ID ${this.donationId}`);
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    if (!this.patchedCorePersonInfo) {
      const idAndJWT = this.identityService.getIdAndJWT();
      if (idAndJWT) {
        let person = this.buildPersonFromDonation(donation);
        person.id = idAndJWT.id;

        // Try to patch the person only if they're not already a finalised donor account,
        // e.g. they could have set a password then reloaded this page.
        if (! this.identityService.isTokenForFinalisedUser(idAndJWT.jwt)) {
          this.identityService.update(person)
            .subscribe({
              next: person => {
                this.patchedCorePersonInfo = true;
                this.person = person;
              },
              error: (error: HttpErrorResponse) => {
                // For now we probably don't really need to inform donors if we didn't patch their Person data, and just won't ask them to
                // set a password if the first step failed. We'll want to monitor Analytics for any patterns suggesting a problem in the logic though.
                this.matomoTracker.trackEvent('identity_error', 'person_core_data_update_failed', `${error.status}: ${error.message}`);
              },
            });
        } // End token-not-finalised condition.
      } // Else no ID JWT saved. Donor may have already set a password but opted to log out.
    } // End ID-feature-enabled condition.

    this.donation = donation;
    this.campaignService.getOneById(donation.projectId).subscribe(campaign => {
      this.campaign = campaign;
      this.pageMeta.setCommon(
        `Thank you for donating to the "${campaign.title}" campaign`,
        ``,
        campaign.bannerUri,
      );
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
        donation.donationAmount
      );

      this.totalPaid = donation.totalPaid;
      this.giftAidAmount = donation.giftAid ? 0.25 * donation.donationAmount : 0;
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
        this.calculateExponentialBackoffMs(this.tries)
      );
      return;
    }

    this.matomoTracker.trackEvent('donate', 'thank_you_timed_out_pre_complete', `Donation to campaign ${donation.projectId}`);
    this.timedOut = true;
  }

  calculateExponentialBackoffMs(tries: number) {
    return (this.retryBaseIntervalSeconds * 1000) * 2 ** tries;
  }

  private buildPersonFromDonation(donation: Donation): Person {
    let person: Person = {
      email_address: donation.emailAddress,
      first_name: donation.firstName,
      last_name: donation.lastName,
    };

    if (donation.giftAid) {
      person.home_address_line_1 = donation.homeAddress;
      person.home_postcode = donation.homePostcode === 'OVERSEAS' ? undefined : donation.homePostcode;
      person.home_country_code = donation.homePostcode === 'OVERSEAS' ? 'OVERSEAS' : 'GB';
    }

    return person;
  }

  private setSocialShares(campaign: Campaign) {
    const prefix = environment.donateUriPrefix;
    this.encodedShareUrl = encodeURIComponent(`${prefix}/campaign/${campaign.id}`);
    this.encodedPrefilledText = encodeURIComponent('I just donated to this campaign, please support their good cause by making a donation.');
  }
}
