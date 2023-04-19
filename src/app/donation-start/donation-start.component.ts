import {CurrencyPipe, DatePipe, getCurrencySymbol} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { PaymentMethod, StripeCardElement, StripePaymentRequestButtonElement } from '@stripe/stripe-js';
import { Subject, Subscription } from 'rxjs';

import { AnalyticsService } from '../analytics.service';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { CardIconsService } from '../card-icons.service';
import { COUNTRIES } from '../countries';
import { Donation } from '../donation.model';
import { DonationService } from '../donation.service';
import { environment } from '../../environments/environment';
import { GiftAidAddressSuggestion } from '../gift-aid-address-suggestion.model';
import { IdentityService } from '../identity.service';
import { MetaPixelService } from '../meta-pixel.service';
import { PageMetaService } from '../page-meta.service';
import { Person } from '../person.model';
import { PostcodeService } from '../postcode.service';
import { StripeService } from '../stripe.service';
import {CampaignGroupsService} from "../campaign-groups.service";
import {TimeLeftPipe} from "../time-left.pipe";
import {ImageService} from "../image.service";
import { DonationStartService } from './donation-start.service';
import { DonationStartFormComponent } from './donation-start-form/donation-start-form.component';

@Component({
  selector: 'app-donation-start',
  templateUrl: './donation-start.component.html',
  styleUrls: ['./donation-start.component.scss'],
  providers: [
    CurrencyPipe,
    TimeLeftPipe,
  ]
})
export class DonationStartComponent implements OnDestroy, OnInit {

  @ViewChild('cardInfo') cardInfo: ElementRef;
  @ViewChild('paymentRequestButton') paymentRequestButtonEl: ElementRef;
  @ViewChild('donation-start-form') form: ElementRef<DonationStartFormComponent>;

  card: StripeCardElement | null;

  paymentRequestButton: StripePaymentRequestButtonElement | null;

  requestButtonShown = false;
  showChampionOptIn = false;

  campaign: Campaign;
  donation?: Donation;

  campaignOpenOnLoad: boolean;

  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;

  countryOptions = COUNTRIES;

  creditPenceToUse = 0; // Set non-zero if logged in and Customer has a credit balance to spend. Caps donation amount too in that case.
  currencySymbol: string;

  donationForm: FormGroup;

  maximumDonationAmount: number;
  noPsps = false;
  psp: 'stripe';
  retrying = false;
  skipPRBs: boolean;
  addressSuggestions: GiftAidAddressSuggestion[] = [];
  donationCreateError = false;
  donationUpdateError = false;
  /** setTimeout reference (timer ID) if applicable. */
  expiryWarning?: ReturnType<typeof setTimeout>; // https://stackoverflow.com/a/56239226
  loadingAddressSuggestions = false;
  personId?: string;
  personIsLoginReady = false;
  privacyUrl = 'https://biggive.org/privacy';
  showAddressLookup: boolean;
  stripePaymentMethodReady = false;
  stripePRBMethodReady = false; // Payment Request Button (Apple/Google Pay) method set.
  stripeError?: string;
  stripeSavedMethods: PaymentMethod[] = [];
  selectedSavedMethod: PaymentMethod | undefined;
  submitting = false;
  termsProvider = `Big Give's`;
  termsUrl = 'https://biggive.org/terms-and-conditions';
  // Track 'Next' clicks so we know when to show missing radio button error messages.
  triedToLeaveGiftAid = false;
  triedToLeaveMarketing = false;
  campaignFinished: boolean;
  campaignOpen: boolean;
  bannerUri: string | null;
  showAllPaymentMethods: boolean = false;

  protected campaignId: string;

  campaignRaised: string; // Formatted
  campaignTarget: string; // Formatted

  @Input() email: string;
  idCaptcha: RecaptchaComponent;

  person: Person;
  personEventSubject: Subject<{person: Person, id: string , jwt: string}> = new Subject<{person: Person, id: string , jwt: string}>();

  emitPersonEventToChild(person: Person, id: string , jwt: string) {
    this.personEventSubject.next({person, id , jwt});
  }

  donationFormSubscription = new Subscription();
  captchaSubscription = new Subscription();
  
  constructor(
    public cardIconsService: CardIconsService,
    public dialog: MatDialog,
    protected identityService: IdentityService,
    private imageService: ImageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    public timeLeftPipe: TimeLeftPipe,
    private donationStartService: DonationStartService,
    private changeDetector:ChangeDetectorRef
  ) {}

  ngOnDestroy() {

    if (this.card) {
      this.card.off('change');
      this.card.destroy();
    }
    this.captchaSubscription.unsubscribe();
    this.donationFormSubscription.unsubscribe();
  }

  ngOnInit() {

    this.campaign = this.route.snapshot.data.campaign;
    this.setCampaignBasedVars();

    this.imageService.getImageUri(this.campaign.bannerUri, 830).subscribe(uri => this.bannerUri = uri);

    // This block of code is copied from campaign-info.component. Apologies for duplication.
    this.campaignTarget = this.currencyPipe.transform(this.campaign.target, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
    this.campaignRaised = this.currencyPipe.transform(this.campaign.amountRaised, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
    this.campaignFinished = CampaignService.isInPast(this.campaign);
    this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);

    this.donationFormSubscription = this.donationStartService.donationFormEventSubject.subscribe((donationForm: FormGroup) => {
      this.donationForm = donationForm;    }
    );
    this.captchaSubscription = this.donationStartService.captchaEventSubject.subscribe((idCaptcha: RecaptchaComponent) => {
      this.idCaptcha = idCaptcha;
      this.changeDetector.detectChanges();
    });
  }

  logout = () => {
    if(this.donationForm) {
      this.creditPenceToUse = 0;
      this.personId = undefined;
      this.personIsLoginReady = false;
      this.stripePaymentMethodReady = false;
      this.donationForm.reset();
      this.identityService.clearJWT();
      this.idCaptcha.reset();
      location.reload();
    }
  }

  summariseAddressSuggestion(suggestion: GiftAidAddressSuggestion | string | undefined): string {
    // Patching the `giftAidGroup` seems to lead to a re-evaluation via this method, even if we use
    // `{emit: false}`. So it seems like the only safe way for the slightly hacky autocomplete return
    // approach of returning an object, then resolving from it, to work, is to explicitly check which
    // type this field has got before re-summarising it.
    if (typeof suggestion === 'string') {
      return suggestion;
    }

    return suggestion?.address || '';
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


  loadAuthedPersonInfo = (id: string, jwt: string) => {
    if(this.identityService) {
      this.identityService.get(id, jwt).subscribe((person: Person) => {
        this.personId = person.id; // Should mean donations are attached to the Stripe Customer.
        this.personIsLoginReady = true;
        this.emitPersonEventToChild(person, id, jwt);
      });
    }
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
