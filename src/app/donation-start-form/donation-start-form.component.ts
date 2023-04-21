import {Component, Host} from '@angular/core';
import { CommonModule } from '@angular/common';
import {COUNTRIES} from "../countries";
import {DonationStartComponent} from "../donation-start/donation-start.component";
import {AbstractControl, FormGroup, ɵGetProperty} from "@angular/forms";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {Campaign} from "../campaign.model";
import { GiftAidAddressSuggestion } from '../gift-aid-address-suggestion.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CardIconsService } from '../card-icons.service';

@Component({
  selector: 'app-donation-start-form',
  standalone: false,
  templateUrl: './donation-start-form.component.html',
  styleUrls: ['./donation-start-form.component.scss']
})
export class DonationStartFormComponent {
  protected donationStart: DonationStartComponent;

  protected readonly COUNTRIES = COUNTRIES;

  protected amountsGroup: FormGroup;
  protected campaign: Campaign;
  protected campaignOpenOnLoad: boolean;
  protected creditPenceToUse: number;
  protected currencySymbol: string;
  protected customTip: () => boolean;
  protected donationAmount: number;
  protected donationAmountField: undefined | AbstractControl<ɵGetProperty<any, "donationAmount">> | null;
  protected donationForm: FormGroup;
  protected maximumDonationAmount: number;
  protected stepChanged: (event: StepperSelectionEvent) => Promise<void>;
  protected submit: () => Promise<void>;
  protected tipAmountField: undefined | AbstractControl<ɵGetProperty<any, "tipAmount">> | null;
  protected tipPercentageChange: () => void;
  protected stripeError: string | undefined;
  protected loadingAddressSuggestions: boolean;
  protected addressSuggestions: GiftAidAddressSuggestion[];
  protected addressChosen: (event: MatAutocompleteSelectedEvent) => void;
  protected giftAidGroup: FormGroup;
  protected summariseAddressSuggestion: (suggestion: (GiftAidAddressSuggestion | string | undefined)) => string;
  protected showAddressLookup: boolean;
  protected triedToLeaveGiftAid: boolean;
  protected captchaIdentityReturn: (captchaResponse: string) => void;
  protected next: () => void;
  protected captchaIdentityError: () => void;
  protected recaptchaIdSiteKey: string;
  protected tipAmount: () => number;
  protected donationCreateError: boolean;
  protected termsUrl: string;
  protected cardIconsService: CardIconsService;
  protected donationAndExtrasAmount: number;
  donationUpdateError: boolean;
  expectedMatchAmount: () => number;
  onUseSavedCardChange: any;
  paymentGroup: FormGroup<any>;
  privacyUrl: string;
  noPsps: boolean;
  requestButtonShown: boolean;
  retrying: boolean;
  selectedSavedMethod: any;
  showAllPaymentMethods: boolean;
  stripePRBMethodReady: boolean;
  giftAidAmount: () => number;
  feeCoverAmount: () => number;
  stripeSavedMethods: any;
  submitting: boolean;
  termsProvider: string;
  triedToLeaveMarketing: boolean;
  countryOptions: { country: string; iso2: string; }[];
  onBillingPostCodeChanged: (event: Event) => void;
  stripePaymentMethodReady: boolean;
  marketingGroup: FormGroup<any>;
  showChampionOptIn: boolean;

  constructor(
    @Host() donationStart: DonationStartComponent
  ) {
    this.amountsGroup = this.donationStart.amountsGroup;
    this.campaign = this.donationStart.campaign;
    this.campaignOpenOnLoad = this.donationStart.campaignOpenOnLoad;
    this.creditPenceToUse = this.donationStart.creditPenceToUse;
    this.currencySymbol = this.donationStart.currencySymbol;
    this.customTip = this.donationStart.customTip;
    this.donationAmount = this.donationStart.donationAmount;
    this.donationAmountField = this.donationStart.donationAmountField;
    this.donationForm = this.donationStart.donationForm;
    this.maximumDonationAmount = this.donationStart.maximumDonationAmount;
    this.stepChanged = this.donationStart.stepChanged;
    this.submit = this.donationStart.submit;
    this.tipAmountField = this.donationStart.tipAmountField;
    this.tipPercentageChange = this.donationStart.tipPercentageChange;


    this.stripeError = this.donationStart.stripeError
    this.tipAmount = this.donationStart.tipAmount
    this.donationCreateError = this.donationStart.donationCreateError
    this.captchaIdentityReturn = this.donationStart.captchaIdentityReturn
    this.captchaIdentityError = this.donationStart.captchaIdentityError
    this.recaptchaIdSiteKey = this.donationStart.recaptchaIdSiteKey
    this.next = this.donationStart.next
    this.giftAidGroup = this.donationStart.giftAidGroup
    this.termsUrl = this.donationStart.termsUrl
    this.triedToLeaveGiftAid = this.donationStart.triedToLeaveGiftAid
    this.giftAidGroup = this.donationStart.giftAidGroup
    this.showAddressLookup = this.donationStart.showAddressLookup
    this.summariseAddressSuggestion = this.donationStart.summariseAddressSuggestion
    this.addressChosen = this.donationStart.addressChosen
    this.addressSuggestions = this.donationStart.addressSuggestions
    this.loadingAddressSuggestions = this.donationStart.loadingAddressSuggestions

    this.cardIconsService = this.donationStart.cardIconsService;
    this.donationAndExtrasAmount = this.donationStart.donationAndExtrasAmount;
    this.donationUpdateError = this.donationStart.donationUpdateError;
    this.expectedMatchAmount = this.donationStart.expectedMatchAmount;
    this.feeCoverAmount = this.donationStart.feeCoverAmount;
    this.giftAidAmount = this.donationStart.giftAidAmount;
    this.noPsps = this.donationStart.noPsps;
    this.onUseSavedCardChange = this.donationStart.onUseSavedCardChange;
    this.paymentGroup = this.donationStart.paymentGroup;
    this.privacyUrl = this.donationStart.privacyUrl;
    this.requestButtonShown = this.donationStart.requestButtonShown;
    this.retrying = this.donationStart.retrying;
    this.selectedSavedMethod = this.donationStart.selectedSavedMethod;
    this.showAllPaymentMethods = this.donationStart.showAllPaymentMethods;
    this.stripePRBMethodReady = this.donationStart.stripePRBMethodReady;
    this.stripeSavedMethods = this.donationStart.stripeSavedMethods;
    this.submitting = this.donationStart.submitting;
    this.termsProvider = this.donationStart.termsProvider;
    this.triedToLeaveMarketing = this.donationStart.triedToLeaveMarketing;
    this.countryOptions = this.donationStart.countryOptions;
    this.onBillingPostCodeChanged = this.donationStart.onBillingPostCodeChanged;
    this.stripePaymentMethodReady = this.donationStart.stripePaymentMethodReady;
    this.marketingGroup = this.donationStart.marketingGroup;
    this.showChampionOptIn = this.donationStart.showChampionOptIn;
  }

}
