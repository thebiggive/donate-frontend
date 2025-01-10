import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Campaign} from "../campaign.model";
import {ComponentsModule} from "@biggive/components-angular";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Person} from "../person.model";
import {RegularGivingService} from "../regularGiving.service";
import {Mandate} from '../mandate.model';
import {myRegularGivingPath} from "../app-routing";
import {requiredNotBlankValidator} from "../validators/notBlank";
import {getCurrencyMinValidator} from "../validators/currency-min";
import {getCurrencyMaxValidator} from "../validators/currency-max";
import {Toast} from "../toast.service";
import {DonorAccount} from "../donorAccount.model";
import {countryOptions} from "../countries";
import {PageMetaService} from "../page-meta.service";
import {StripeService} from "../stripe.service";
import {ConfirmationToken, StripeElements, StripePaymentElement} from "@stripe/stripe-js";
import {DonationService, StripeCustomerSession} from "../donation.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

// for now min & max are hard-coded, will change to be based on a field on
// the campaign.
const maxAmount = 500;
const minAmount = 1;

@Component({
  selector: 'app-regular-giving',
  standalone: true,
  imports: [
    ComponentsModule,
    FormsModule,
    MatStep,
    MatStepper,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatIcon,
    MatProgressSpinner
  ],
  templateUrl: './regular-giving.component.html',
  styleUrl: './regular-giving.component.scss'
})
export class RegularGivingComponent implements OnInit, AfterViewInit {
  protected campaign: Campaign;
  mandateForm: FormGroup;
  @ViewChild('stepper') private stepper: MatStepper;
  readonly termsUrl = 'https://biggive.org/terms-and-conditions';
  readonly privacyUrl = 'https://biggive.org/privacy';
  protected donor: Person;
  protected donorAccount: DonorAccount;
  protected countryOptionsObject = countryOptions;
  protected selectedBillingCountryCode: string;
  private stripeElements: StripeElements | undefined;
  private stripePaymentElement: StripePaymentElement | undefined;

  public readonly labelYourPaymentInformation = "Your Payment Information";

  @ViewChild('cardInfo') protected cardInfo: ElementRef;
  private stripeCustomerSession: StripeCustomerSession | undefined;
  protected submitting: boolean = false;

  protected amountErrorMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toast: Toast,
    private regularGivingService: RegularGivingService,
    private router: Router,
    private pageMeta: PageMetaService,
    private stripeService: StripeService,
    private donationService: DonationService,
  ) {
  }

  ngOnInit() {
    const donor: Person | null = this.route.snapshot.data.donor;
    if (! donor) {
      throw new Error("Must be logged in to see regular giving page");
    }
    this.donor = donor;
    this.donorAccount = this.route.snapshot.data.donorAccount

    this.campaign = this.route.snapshot.data.campaign;

    if ( !this.campaign.isRegularGiving ) {
      console.error("Campaign " + this.campaign.id + " is not a regular giving campaign");
    }

    this.pageMeta.setCommon(
      `Regular Giving for ${this.campaign.charity.name}`,
      `Regular Giving for ${this.campaign.charity.name}`,
      this.campaign.bannerUri,
    );

    this.selectedBillingCountryCode = this.donorAccount.billingCountryCode ?? 'GB';

    this.mandateForm = this.formBuilder.group({
        donationAmount: ['', [
          requiredNotBlankValidator,
          getCurrencyMinValidator(minAmount),
          getCurrencyMaxValidator(maxAmount),
          Validators.pattern('^\\s*[£$]?[0-9]+?(\\.00)?\\s*$'),
        ]],
      billingPostcode: [this.donorAccount.billingPostCode,
        [] // @todo-regular-giving - add postcode validation as in donation-start-form
      ],
      }
    );

    this.stripeService.init().catch(console.error);

    this.donationService.createCustomerSessionForRegularGiving({campaign: this.campaign})
      .then((session) => {
        this.stripeCustomerSession = session;
        if (! this.stripeElements && this.stepper.selected?.label === this.labelYourPaymentInformation) {
          this.prepareStripeElements();
        }
      })
      .catch(console.error);
  }

  ngAfterViewInit() {
    // It seems the stepper doesn't provide a nice way to let us intercept each request to change step. Monkey-patching
    // the select function which is called when the user clicks a step heading, to let us check that all previous
    // steps have been completed correctly, and then either proceed to the chosen step or display an error message.

    // Based on https://stackoverflow.com/a/62787311/2526181 - I'm not 100% sure why it's wrapped in setTimeout but
    // maybe returning immediately from ngAfterViewInit improves performance.

    setTimeout(() => {
      this.stepper.steps.forEach((step, stepIndex) => {
        step.select = () => {
          this.selectStep(stepIndex);
        };
      });
    });
  }

  async interceptSubmitAndProceedInstead(event: Event) {
    event.preventDefault();
    await this.next();
  }

  stepChanged(event: StepperSelectionEvent) {
    if (event.selectedStep.label === this.labelYourPaymentInformation) {
      this.prepareStripeElements();
    }
  }

  async next() {
    this.stepper.next();
  }

  async submit() {
    const invalid = this.mandateForm.invalid;
    if (invalid) {
      let errorMessage = 'Form error: ';
      if (this.mandateForm.get('donationAmount')?.hasError('required')) {
        errorMessage += "Monthly donation amount is required";
      }
      this.toast.showError(errorMessage);
      return;
    }

    const billingPostcode: string = this.mandateForm.value.billingPostcode;
    const billingCountry: string = this.selectedBillingCountryCode;

    let confirmationToken: ConfirmationToken | undefined;
    if (!this.stripeElements && !this.donorAccount.regularGivingPaymentMethod) {
      throw new Error('Missing both stripe elements and on-file payment method, cannot setup regular giving mandate.');
    }

    this.submitting = true;

    if (this.stripeElements && !this.donorAccount.regularGivingPaymentMethod) {
      const confirmationTokenResult = await this.stripeService.prepareConfirmationTokenFromPaymentElement(
        {billingPostalAddress: billingPostcode, countryCode: billingCountry},
        this.stripeElements
      );

      confirmationToken = confirmationTokenResult.confirmationToken;
    }
    if (!this.donorAccount.regularGivingPaymentMethod && !confirmationToken) {
      this.submitting = false;
      throw new Error("Stripe Confirmation token is missing");
    }

    /**
     * @todo-regular-giving consider if we need to send this from FE - if we're not displaying it to donor better for matchbot to
     *       generate it.*/
    const dayOfMonth = Math.min(new Date().getDate(), 28);

    this.regularGivingService.startMandate({
      amountInPence: this.getDonationAmountPence(),
      dayOfMonth,
      campaignId: this.campaign.id,
      currency: "GBP",
      giftAid: false,
      billingPostcode,
      billingCountry,
      stripeConfirmationTokenId: confirmationToken?.id
    }).subscribe({
    next: async (mandate: Mandate) => {
      await this.router.navigateByUrl(`${myRegularGivingPath}/${mandate.id}`);
    },
      error: (error: {error: {error: {description?: string} }}) => {
      console.error(error);
      const message = error.error.error.description ?? 'Sorry, something went wrong';
        this.toast.showError(message);
      }
    })
  }

  private getDonationAmountPence(): number {
    return 100 * this.mandateForm.value.donationAmount;
  }

  protected setSelectedCountry = ((countryCode: string) => {
    this.selectedBillingCountryCode = countryCode;
    this.mandateForm.patchValue({
      billingCountry: countryCode,
    });
  })

  protected onBillingPostCodeChanged(_: Event) {
    // no-op for now, but @todo-regular-giving we may need to do some validation as we don the ad-hoc donation page.
  }

  private prepareStripeElements() {
    if (! this.selectedBillingCountryCode) {
      return;
    }

    if (!this.stripeCustomerSession) {
      return;
    }

    if (this.stripeElements) {
      this.stripeElements.update({amount: this.getDonationAmountPence()})
    } else {
      this.stripeElements = this.stripeService.stripeElements(
        {
          amount: this.getDonationAmountPence(),
          currency: this.campaign.currencyCode
        },
        'off_session',
        this.campaign,
        this.stripeCustomerSession.stripeSessionSecret
      );
    }

    if (this.stripePaymentElement) {
      // Payment element was already ready & we presume mounted.
      return;
    }

    const stripeElements = this.stripeElements;
    this.stripePaymentElement = StripeService.createStripeElement(stripeElements);

    if (this.cardInfo && this.stripePaymentElement) {
      this.stripePaymentElement.mount(this.cardInfo.nativeElement);
      this.stripePaymentElement.on('change', () => {}); // @todo-regular-giving: implement card change handler
    }
  }

  protected selectStep(stepIndex: number) {

    const donationAmountErrors = this.mandateForm.controls.donationAmount!.errors;

    if (donationAmountErrors) {
      console.error(donationAmountErrors);
      for (const [key] of Object.entries(donationAmountErrors)) {
        switch (key) {
          case 'required':
            this.amountErrorMessage = "Please enter your monthly donation amount";
            break;
          case 'pattern':
            this.amountErrorMessage = `Please enter a whole number of £ without commas`;
            break;
          case 'max':
          case 'min':
            this.amountErrorMessage = `Please select an amount between £${minAmount} and £${maxAmount}`;
            break;
          default:
            this.amountErrorMessage = 'Unexpected donation amount error';
            console.error({donationAmountErrors});
            break;
        }
      }
      this.toast.showError(this.amountErrorMessage!);

      return;
    } else {
      this.amountErrorMessage = undefined;
    }

    this.stepper.selected = this.stepper.steps.get(stepIndex);
  }
}
