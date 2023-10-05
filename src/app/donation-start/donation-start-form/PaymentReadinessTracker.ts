/**
 * This object tracks whether a donor is ready to progress past the payment stage of the donation start form. At time of
 * writing it just returns a boolean from readyToProgressFromPaymentStep, but my plan is to add a function to return
 * a list of reasons *why* we are not ready for them to proceed that we can display using snackbar.
 *
 * Originally extracted from the DonationStartFormComponent
 */
export class PaymentReadinessTracker {
  /**
   * Property name taken from the component. The name doesn't really reflect the usage. Planning to remove this property.
   */
  private stripePaymentMethodReady: boolean = false;


  /**
   * Any saved card that the donor has indicated they want to re-use for this donation. For the purpose of this class
   * we only care about whether it's truthy or falsy.
   */
  private selectedSavedMethod: unknown = undefined;


  /**
   * Whether or not a complete payment method has been entered into the payment element
   */
  private stripeManualCardInputValid: boolean = false;

  /**
   * Balance of the donors funds accounts in pence
   */
  private creditPenceToUse: number = 0;

  constructor(
    /**
     * Payment group from the Material form. If Angular Material has a validation error then we're not going to be ready
     * to proceed.
     */
    private paymentGroup: { valid: boolean },
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
