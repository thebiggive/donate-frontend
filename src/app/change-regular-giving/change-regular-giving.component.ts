import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  PaymentIntentOrSetupIntentResult,
  PaymentMethod,
  SetupIntent,
  SetupIntentResult,
  StripeElements,
  StripePaymentElement
} from '@stripe/stripe-js';
import {ComponentsModule} from "@biggive/components-angular";
import {StripeService} from "../stripe.service";
import {Toast} from '../toast.service';
import {RegularGivingService} from '../regularGiving.service';
import {countryISO2, countryOptions} from '../countries';
import {MatInput} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {requiredNotBlankValidator} from '../validators/notBlank';

@Component({
  selector: 'app-change-regular-giving',
  imports: [
    ComponentsModule,
    MatInput,
    ReactiveFormsModule,
  ],
  templateUrl: './change-regular-giving.component.html',
  styleUrl: './change-regular-giving.component.scss'
})
export class ChangeRegularGivingComponent implements OnInit {
  protected setupIntent: SetupIntent;
  @ViewChild('cardInfo') protected cardInfo?: ElementRef;

  protected paymentMethods: {
    adHocMethods: PaymentMethod[],
    regularGivingPaymentMethod?: PaymentMethod,
  };
  private stripePaymentElement: StripePaymentElement | undefined;
  private stripeElements: StripeElements | undefined;
  protected errorMessage: string | undefined;
  protected selectedCountryCode: countryISO2 | undefined;

  protected paymentMethodForm = new FormGroup({
    billingPostcode: new FormControl('', [
      requiredNotBlankValidator,
    ])
  });

  constructor(
    private stripeService: StripeService,
    private regularGivingService: RegularGivingService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: Toast,
  ) {
    this.paymentMethods = this.route.snapshot.data.paymentMethods;
    this.setupIntent = this.route.snapshot.data.setupIntent;
  }

  async ngOnInit() {
    await this.stripeService.init().catch(console.error);
    this.selectedCountryCode = this.paymentMethods.regularGivingPaymentMethod?.billing_details?.address?.country as countryISO2 || undefined

    const clientSecret = this.setupIntent.client_secret;
    if (!clientSecret) {
      throw new Error('Client secret not set on setup intent');
    }

    [this.stripeElements, this.stripePaymentElement] = this.stripeService.stripeElementsForRegularGivingPaymentMethod(clientSecret);
    this.stripePaymentElement.mount(this.cardInfo?.nativeElement);
  }

  protected async confirmSetup(): Promise<void> {
    const stripeElements = this.stripeElements;
    if (!stripeElements) {
      this.toaster.showError(
        "Sorry, our payment card component did not load. Please retry or contact Big Give if the problem persists"
      );
      return;
    }

    let setupIntentResult: SetupIntentResult;
    let paymentIntentOrSetupIntentResult: PaymentIntentOrSetupIntentResult;
    try {
      if (this.paymentMethodForm.controls.billingPostcode.invalid) {
        this.errorMessage = "Please enter your billing postal code";
        this.toaster.showError(this.errorMessage);
        return;
      }

      const countryCode = this.selectedCountryCode;
      const billingPostalCode = this.paymentMethodForm.value.billingPostcode;

      if (!countryCode) {
        this.errorMessage = "Please select your billing country";
        this.toaster.showError(this.errorMessage);
        return;
      }

      if (!billingPostalCode) {
        // should be impossible due to form validation
        this.errorMessage = "Please select your billing postcode";
        this.toaster.showError(this.errorMessage);
        return;
      }


      setupIntentResult = await this.stripeService.confirmSetup({
          stripeElements: stripeElements,
          billingCountryCode: countryCode,
          billingPostalCode: billingPostalCode,
          return_url: window.location.href
        }
      );
    } catch (error: unknown) {
      // @ts-expect-error
      this.errorMessage = error?.message || 'Unexpected error';
      this.toaster.showError(this.errorMessage!);
      console.error(error);
      return;
    }
    if (setupIntentResult.setupIntent?.next_action) {
      paymentIntentOrSetupIntentResult = await this.stripeService.handleNextAction(this.setupIntent.client_secret!);
      if (paymentIntentOrSetupIntentResult.setupIntent?.status !== 'succeeded') {
        const errorMessage = "Payment method setup failed: " + paymentIntentOrSetupIntentResult?.error?.message;
        this.errorMessage = errorMessage;
        this.toaster.showError(errorMessage)
        return;
      }
      const pmID = paymentIntentOrSetupIntentResult.setupIntent?.payment_method;
      if (typeof pmID !== 'string') {
        throw new Error("expected payment method id to be string");
      }

      await this.regularGivingService.setRegularGivingPaymentMethod(pmID);
      this.toaster.showSuccess("Updated your payment method for regular giving");
      await this.router.navigateByUrl('/my-account/payment-methods');
    }

    const pmID = setupIntentResult.setupIntent?.payment_method
    if (setupIntentResult.setupIntent?.status !== 'succeeded') {
      console.log({setupIntentResult});
      const errorMessage = "Payment method setup failed: " + setupIntentResult?.error?.message;
      this.errorMessage = errorMessage;
      this.toaster.showError(errorMessage)
      return;
    }

    if (typeof pmID !== 'string') {
      throw new Error("expected payment method id to be string");
    }
    await this.regularGivingService.setRegularGivingPaymentMethod(pmID);
    this.toaster.showSuccess("Updated your payment method for regular giving");
    await this.router.navigateByUrl('/my-account/payment-methods');
  }

  protected readonly countryOptionsObject = countryOptions;

  protected setSelectedCountry(country: countryISO2) {
    this.selectedCountryCode = country;
  }
}
