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

  /**
   * Does the logged in donor have a saved card, even if they don't want to use it?
   */
  private hasASavedCard: boolean = false;
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
    return this.getErrorsBlockingProgress().length === 0;
  }

  /**
   * Returns an array of messages explaining why the donor cannot immediately progress past the payment step. Will
   * be displayed to them so they can fix.
   */
  public getErrorsBlockingProgress(): string[] {
    const usingSavedCard = !!this.selectedSavedMethod && this.useSavedCard;
    const atLeastOneWayOfPayingIsReady = this.donorFunds || usingSavedCard || this.paymentElementIsComplete;

    let paymentErrors: string[] = [];
    if (!atLeastOneWayOfPayingIsReady) {
      paymentErrors = [
        this.hasASavedCard ?
          "Please complete your new payment method, or select a saved payment method." :
          "Please complete your payment method."
      ];
    }

    return [...this.humanReadableFormValidationErrors(), ...paymentErrors];
  }

  private humanReadableFormValidationErrors() {
    const fieldNames = {
      firstName: 'first name',
      lastName: 'last name',
      emailAddress: 'email address',
      billingPostcode: 'billing postcode',
    }

    const errors = this.getFormValidationErrors().map((error) => {
      const key = error.key as keyof typeof fieldNames;

      const fieldName = fieldNames[key] || key;

      switch (error.error) {
        case 'required':
          return `Please enter your ${fieldName}.`;
        case 'pattern':
          return `Sorry, your ${fieldName} is not recognised - please enter a valid ${fieldName}.`;
        default:
          console.error(error);
          return `Sorry, there is an error with the ${fieldName} field.`;
      }
    });

    if (errors.length === 0 && ! this.paymentGroup.valid ) {
      // hopefully will never happen in prod.
      console.error("Unexpected payment group error");
      return ['Please check all fields in the payment section and correct any errors.'];
    }

    return errors;
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
    this.hasASavedCard = true;
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
