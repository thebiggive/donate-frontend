import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import { MatDialog } from '@angular/material/dialog';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { MatomoTracker } from 'ngx-matomo';
import { RecaptchaComponent } from 'ng-recaptcha';

import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { Credentials } from '../credentials.model';
import { Donation } from '../donation.model';
import { DonationCompleteSetPasswordDialogComponent } from './donation-complete-set-password-dialog.component';
import { DonationService } from '../donation.service';
import { environment } from '../../environments/environment';
import { minPasswordLength } from '../../environments/common';
import { IdentityService } from '../identity.service';
import { PageMetaService } from '../page-meta.service';
import { Person } from '../person.model';

@Component({
  selector: 'app-donation-complete',
  templateUrl: './donation-complete.component.html',
  styleUrls: ['./donation-complete.component.scss'],
})
export class DonationCompleteComponent implements OnInit {
  @Input({ required: true }) private donationId: string;
  @ViewChild('captcha') captcha: RecaptchaComponent;

  campaign?: Campaign;
  cardChargedAmount: number;
  complete = false;
  donation: Donation;
  encodedShareUrl: string;
  giftAidAmount: number;
  loggedIn = false;
  minPasswordLength: number;
  noAccess = false;
  offerToSetPassword = false;
  encodedPrefilledText: string;
  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;
  registerError?: string;
  registerErrorDescription?: string = undefined;
  registerErrorDescriptionHtml?: SafeHtml = undefined;
  registrationComplete = false;
  timedOut = false;
  totalValue: number;
  donationIsLarge: boolean = false;
  private readonly maxTries = 5;
  private patchedCorePersonInfo = false;
  private person?: Person;
  private readonly retryBaseIntervalSeconds = 2;
  private tries = 0;

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
  }

  ngOnInit() {
    this.checkDonation();
    
    this.minPasswordLength = minPasswordLength;

    this.identityService.getLoggedInPerson().subscribe((person: Person|null) => {
      this.loggedIn = !!person && !!person.has_password;

      this.isDataLoaded = true;
    });
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
      () => this.timedOut = true,
    );
  }

  openSetPasswordDialog() {
    const passwordSetDialog = this.dialog.open(DonationCompleteSetPasswordDialogComponent, {
      data: { person: this.person },
    });
    passwordSetDialog.afterClosed().subscribe(data => {
      if (data.password) {
        this.setPassword(data.password, data.stayLoggedIn || false);
      }
    });
  }

  loginCaptchaReturn(captchaResponse: string) {
    if (captchaResponse === null) {
      // This is expected after ~1 min when the code expires. At this point we should
      // never be executing the login again because if the captcha was set up at all then
      // we auto-logged-in with the password the donor just chose.
      return;
    }

    const credentials: Credentials = {
      email_address: this.donation.emailAddress as string,
      raw_password: this.person?.raw_password as string,
      captcha_code: captchaResponse,
    };

    this.identityService.login(credentials)
      .subscribe(response => {
        // It's still the same person, just an upgraded / "complete" token. So for now just recycle the ID. We'll probably improve
        // `/auth` to return the ID separately soon, so we can do a normal login form that's able to call this without
        // having to decode the JWT (though maybe that's a good thing for the frontend to be able to do anyway?).
        // For now, keep console logging these even live, because the app
        // gives no visual indication that a longer-term token's been
        // set up yet.
        console.log('Upgraded local token to a long-lived one with more permissions');
        this.identityService.saveJWT(this.person?.id as string, response.jwt);
        location.reload();
      },
      (error: HttpErrorResponse) => {
        this.matomoTracker.trackEvent('identity_error', 'login_failed', `${error.status}: ${error.message}`);
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
          this.captcha.execute(); // Leads to loginCaptchaReturn() assuming the captcha succeeds.
        } else {
          // Otherwise we should remove even the temporary ID token.
          this.identityService.clearJWT();
        }
      },
      error: (error: HttpErrorResponse) => {
        const htmlErrorDescription = error.error?.error?.htmlDescription;
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
        if (this.identityService.isTokenForFinalisedUser(idAndJWT.jwt)) {
          this.registrationComplete = true;
        } else {
          this.identityService.update(person)
            .subscribe({
              next: person => {
                this.patchedCorePersonInfo = true;
                this.person = person;
                this.offerToSetPassword = !person.has_password;
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
      this.matomoTracker.trackEvent('donate', 'thank_you_fully_loaded', `Donation to campaign ${donation.projectId}`);

      if (donation.tipAmount > 0 && environment.matomoNonZeroTipGoalId && donation.currencyCode === 'GBP') {
        this.matomoTracker.trackGoal(environment.matomoNonZeroTipGoalId, donation.tipAmount);
      }

      this.cardChargedAmount = donation.donationAmount + donation.feeCoverAmount + donation.tipAmount;
      this.giftAidAmount = donation.giftAid ? 0.25 * donation.donationAmount : 0;
      this.totalValue = donation.donationAmount + this.giftAidAmount + donation.matchedAmount;
      this.donationIsLarge = donation.currencyCode === 'GBP' && donation.donationAmount >= 5_000;
      this.complete = true;

      // Re-save the donation with its new status so we don't offer to resume it if the donor
      // goes back to the same campaign.
      this.donationService.updateLocalDonation(donation);

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
    const prefix = environment.donateGlobalUriPrefix;
    this.encodedShareUrl = encodeURIComponent(`${prefix}/campaign/${campaign.id}`);
    this.encodedPrefilledText = encodeURIComponent('I just donated to this campaign, please support their good cause by making a donation.');
  }
}
