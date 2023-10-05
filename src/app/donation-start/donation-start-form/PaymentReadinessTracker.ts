/**
 * This object tracks whether a donor is ready to progress past the payment stage of the donation start form. At time of
 * writing it just returns a boolean from readyToProgressFromPaymentStep, but my plan is to add a function to return
 * a list of reasons *why* we are not ready for them to proceed that we can display using snackbar.
 *
 * Originally extracted from the DonationStartFormComponent
 */
export class PaymentReadinessTracker {
  constructor(
    private stripePaymentMethodReady: boolean = false,
    private selectedSavedMethod: unknown = undefined,
    private paymentGroup: { valid: boolean },
    private stripeManualCardInputValid: boolean = false,
    private creditPenceToUse: number = 0,
) {
  }

  get readyToProgressFromPaymentStep(): boolean {
    return !((!this.stripePaymentMethodReady && !this.selectedSavedMethod) || !this.paymentGroup.valid)
  }

  selectedSavedPaymentMethod() {
    this.stripePaymentMethodReady = true;
    this.selectedSavedMethod = true;
  }

  donorHasCredit() {
    this.stripePaymentMethodReady = true;
  }

  updateForStepChange() {
    this.stripePaymentMethodReady = !!this.selectedSavedMethod || this.stripeManualCardInputValid || this.creditPenceToUse > 0;
  }

  onStripeCardChange(state: { complete: boolean }) {
    this.stripeManualCardInputValid = this.stripePaymentMethodReady = state.complete;
  }

  onUseSavedCardChange(useSavedCard: boolean) {
    this.stripePaymentMethodReady = useSavedCard || this.stripeManualCardInputValid;
  }

  donationCreditsPrepared(creditPenceToUse: number) {
    this.stripePaymentMethodReady = true;
    this.creditPenceToUse = creditPenceToUse;
  }

  formUpdatedWithBillingDetails() {
    this.stripePaymentMethodReady = true;
  }

  clearSavedPaymentMethod() {
    this.selectedSavedMethod = undefined;
  }
}
