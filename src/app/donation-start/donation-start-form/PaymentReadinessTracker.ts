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
   * Does the stripe payment element have a complete card, selected wallet or equivalent?
   */
  private paymentElementIsComplete: boolean = false;

  /**
   * Do we have a logged-in donor with a non-zero funds balance?
   */
  private donorFunds: boolean = false;


  constructor(
    /**
     * Payment group from the Material form. If Angular Material has a validation error then we're not going to be ready
     * to proceed.
     */
    private paymentGroup: {
      controls: {
        [key: string]: {
          errors: {
            [key: string]: unknown;
          } | null
        }},

        valid: boolean
    }
) {
  }

  get readyToProgressFromPaymentStep(): boolean {
    const usingSavedCard = !!this.selectedSavedMethod && this.useSavedCard;
    const atLeastOneWayOfPayingIsReady = this.donorFunds || usingSavedCard || this.paymentElementIsComplete;
    const formHasNoValidationErrors = this.paymentGroup.valid;

    return formHasNoValidationErrors && atLeastOneWayOfPayingIsReady
  }

  /**
   * Returns an array of messages explaining why the donor cannot immediately progress past the payment step. Will
   * be displayed to them so they can fix.
   */
  public getErrorsBlockingProgress(): string[] {
    // todo - add in error message about lack of way to pay.
    return this.humanReadableFormValidationErrors();
  }

  /**
   * todo - translate keys to human readable names, deal with errors other than 'reqauired'
   */
  private humanReadableFormValidationErrors() {
    return this.getFormValidationErrors().map((error) => {
      switch (error.error) {
        case 'required':
          return `Please complete field  ${error.key}.`;
        default:
          return `Unknown error with field  ${error.key}.`;
      }
    });
  }

  getFormValidationErrors(): { key: string; error: string }[] {
    const errors: {key: string, error: string}[] = [];

    Object.entries(this.paymentGroup.controls).forEach(([key, control]) => {
      const errorsFromThisControl = Object.entries(control.errors ?? []).filter(Boolean);

      errorsFromThisControl.forEach(([errorType]) => errors.push({key: key, error: errorType}))
    });

    return errors;
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
