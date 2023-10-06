/**
 * This object tracks whether a donor is ready to progress past the payment stage of the donation start form. At time of
 * writing it just returns a boolean from readyToProgressFromPaymentStep, but my plan is to add a function to return
 * a list of reasons *why* we are not ready for them to proceed that we can display using snackbar.
 *
 * Originally extracted from the DonationStartFormComponent
 */
export class PaymentReadinessTracker {
  /**
   * The selected saved payment method, if any. In this class we only care whether it's defined or not.
   */
  private selectedSavedMethod: unknown = undefined;

  /**
   * Does the donor want to use that method?
   */
  private useSavedCard: boolean = false;

  /**
   * Does the stripe payment element have a complete card?
   */
  private paymentElementIsComplete: boolean = false;

  /**
   * Balance of the donors funds accounts in pence
   */
  private donorFunds: boolean = false;


  constructor(
    /**
     * Payment group from the Material form. If Angular Material has a validation error then we're not going to be ready
     * to proceed.
     */
    private paymentGroup: { valid: boolean },
) {
  }

  get readyToProgressFromPaymentStep(): boolean {
    const usingSavedCard = !!this.selectedSavedMethod && this.useSavedCard;
    const atLeastOneWayOfPayingIsReady = this.donorFunds || usingSavedCard || this.paymentElementIsComplete;
    const formHasNoValidationErrors = this.paymentGroup.valid;

    return formHasNoValidationErrors && atLeastOneWayOfPayingIsReady
  }

  /**
   * Returns an object with properties that may each be an error message giving a reason why we can't immediately let
   * the user progress.
   */
  errorMessagesForAttemptToProgress() {
    const usingSavedCard = !!this.selectedSavedMethod && this.useSavedCard;
    const atLeastOneWayOfPayingIsReady = this.donorFunds || usingSavedCard || this.paymentElementIsComplete;

    const noWayToPayMessage = "Plea";
    return {
      // todo - replace error below with something more specific to the individual fields of the form.
      formValidationError: !this.paymentGroup.valid ? "Please fill in all required fields of the form" : undefined,
      noWayToPay: !atLeastOneWayOfPayingIsReady ? noWayToPayMessage : undefined,
    };
  }

  selectedSavedPaymentMethod() {
    this.selectedSavedMethod = true;
    this.useSavedCard = true;
  }

  donorHasFunds() {
    this.donorFunds = true;
  }

  onStripeCardChange(state: { complete: boolean }) {
    this.paymentElementIsComplete = state.complete;
  }

  onUseSavedCardChange(useSavedCard: boolean) {
    this.useSavedCard = useSavedCard;
  }

  donationFundsPrepared(fundPenceToUse: number) {
    this.donorFunds = fundPenceToUse > 0;
  }

  clearSavedPaymentMethod() {
    this.selectedSavedMethod = undefined;
  }
}
