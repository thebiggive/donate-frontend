import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CurrencyPipe, DatePipe, getCurrencySymbol } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { Donation } from '../donation.model';
import { environment } from '../../environments/environment';
import { IdentityService } from '../identity.service';
import { Person } from '../person.model';
import {CampaignGroupsService} from "../campaign-groups.service";
import {TimeLeftPipe} from "../time-left.pipe";
import {ImageService} from "../image.service";
import { FormGroup } from '@angular/forms';
import { PaymentMethod } from '@stripe/stripe-js';

@Component({
  selector: 'app-donation-start',
  templateUrl: './donation-start.component.html',
  styleUrls: ['./donation-start.component.scss'],
  providers: [
    CurrencyPipe,
    TimeLeftPipe,
  ]
})
export class DonationStartComponent implements 

  OnInit {
  @ViewChild('idCaptcha') idCaptcha: RecaptchaComponent;

  showChampionOptIn = false;

  campaign: Campaign;
  donation?: Donation;

  campaignOpenOnLoad: boolean;

  creditPenceToUse = 0; // Set non-zero if logged in and Customer has a credit balance to spend. Caps donation amount too in that case.
  currencySymbol: string;

  donationForm: FormGroup;

  noPsps = false;
  psp: 'stripe';

  personId?: string;
  personIsLoginReady = false;

  stripePaymentMethodReady = false;

  stripeFirstSavedMethod?: PaymentMethod;

  campaignFinished: boolean;
  campaignOpen: boolean;
  bannerUri: string | null;

  campaignId: string;

  campaignRaised: string; // Formatted
  campaignTarget: string; // Formatted
  @Input() email: string;
  person: Person;
  eventsSubject: Subject<{person: Person, id: string , jwt: string}> = new Subject<{person: Person, id: string , jwt: string}>();

  emitEventToChild(person: Person, id: string , jwt: string) {
    this.eventsSubject.next({person, id , jwt});
  }

  constructor(
    private imageService: ImageService,
    public identityService: IdentityService, //send as input to child
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    public timeLeftPipe: TimeLeftPipe,

  ) {}

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.setCampaignBasedVars();

    this.imageService.getImageUri(this.campaign.bannerUri, 830).subscribe(uri => this.bannerUri = uri);

    // This block of code is copied from campaign-info.component. Apologies for duplication.
    this.campaignTarget = this.currencyPipe.transform(this.campaign.target, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
    this.campaignRaised = this.currencyPipe.transform(this.campaign.amountRaised, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
    this.campaignFinished = CampaignService.isInPast(this.campaign);
    this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
  }

 
  logout() {
    this.creditPenceToUse = 0;
    this.personId = undefined;
    this.personIsLoginReady = false;
    this.stripeFirstSavedMethod = undefined;
    this.stripePaymentMethodReady = false;
    this.donationForm.reset();
    this.identityService.clearJWT();
    this.idCaptcha.reset();
    location.reload();
  }

  
  get canLogin() {
    return !this.personId;
  }


  reservationExpiryTime(): Date | undefined {
    if (!this.donation?.createdTime || !this.donation.matchReservedAmount) {
      return undefined;
    }

    return new Date(environment.reservationMinutes * 60000 + (new Date(this.donation.createdTime)).getTime());
  }


  loadAuthedPersonInfo(id: string, jwt: string) {
    this.identityService.get(id, jwt).subscribe((person: Person) => {
      this.person =  person;
      this.personId = person.id; // Should mean donations are attached to the Stripe Customer.
      this.personIsLoginReady = true;
      this.emitEventToChild(person, id, jwt);
    });
  }


  /**
   * Unlike the CampaignService method which is more forgiving if the status gets stuck Active (we don't trust
   * these to be right in Salesforce yet), this check relies solely on campaign dates.
   */
  private campaignIsOpen(): boolean {
    return (
      this.campaign
        ? (new Date(this.campaign.startDate) <= new Date() && new Date(this.campaign.endDate) > new Date())
        : false
      );
  }


  /**
   * Redirect if campaign's not open yet; set up page metadata if it is
   */
  private setCampaignBasedVars() {
    this.campaignId = this.campaign.id;

    // We want to let donors finish the journey if they're on the page before the campaign
    // close date and it passes while they're completing the form – in particular they should
    // be able to use match funds secured until 30 minutes after the close time.
    this.campaignOpenOnLoad = this.campaignIsOpen();

    this.currencySymbol = getCurrencySymbol(this.campaign.currencyCode, 'narrow', 'en-GB');

    if (environment.psps.stripe.enabled && this.campaign.charity.stripeAccountId) {
      this.psp = 'stripe';
    } else {
      this.noPsps = true;
    }

    if (this.campaign.championOptInStatement) {
      this.showChampionOptIn = true;
    }
  }

  // Three functions below copied from campaign-info.component. Apologies for duplication.
  getBeneficiaryIcon(beneficiary: string) {
    return CampaignGroupsService.getBeneficiaryIcon(beneficiary);
  }

  getCategoryIcon(category: string) {
    return CampaignGroupsService.getCategoryIcon(category);
  }

  getPercentageRaised(campaign: Campaign): number | undefined {
    return CampaignService.percentRaised(campaign);
  }
}
