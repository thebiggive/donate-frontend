export class PaymentReadinessTracker {
  constructor(
    private stripePaymentMethodReady: boolean = false,
    private selectedSavedMethod: unknown = undefined,
    private paymentGroup: { valid: boolean } = {valid: false},
    private stripeManualCardInputValid: boolean,
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
