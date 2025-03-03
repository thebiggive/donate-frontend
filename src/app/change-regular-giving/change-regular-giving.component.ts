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
import {DonationService} from '../donation.service';

@Component({
  selector: 'app-change-regular-giving',
  imports: [
    ComponentsModule,
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

  constructor(
      private stripeService: StripeService,
      private regularGivingService: RegularGivingService,
      private donationService: DonationService,
      private route: ActivatedRoute,
      private router: Router,
      private toaster: Toast,
  ) {
    this.paymentMethods = this.route.snapshot.data.paymentMethods;
    this.setupIntent = this.route.snapshot.data.setupIntent;
  }

  async ngOnInit() {
     await this.stripeService.init().catch(console.error);

   if (this.setupIntent) {
     const clientSecret = this.setupIntent.client_secret;
     if (clientSecret) {
       [this.stripeElements, this.stripePaymentElement] = this.stripeService.stripeElementsForRegularGivingPaymentMethod(clientSecret);
       this.stripePaymentElement.mount(this.cardInfo?.nativeElement);
     }
   }
  }

  protected async confirmSetup(): Promise<void> {
    if (!this.setupIntent) {
      throw new Error("Missing setup intent");
    }

    const stripeElements = this.stripeElements;
    if (! stripeElements) {
      this.toaster.showError(
        "Sorry, our payment card component did not load. Please retry or contact Big Give if the problem persists"
      );
      return;
    }

    let setupIntentResult: SetupIntentResult;
    let paymentIntentOrSetupIntentResult: PaymentIntentOrSetupIntentResult;
    try {
      setupIntentResult = await this.stripeService.confirmSetup(stripeElements, window.location.href);
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
}
