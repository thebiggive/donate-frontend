import {PaymentReadinessTracker} from "./PaymentReadinessTracker";

describe('PaymentReadinessTracker', () => {
  it('Initially says we are not ready to progress from payment step', () => {
    const sut = new PaymentReadinessTracker({valid: true});

    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  })

  it("Allows proceeding from payment step when a saved card is selected", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.selectedSavedPaymentMethod();
    sut.updateForStepChange();
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it("Blocks proceeding from payment step when a saved card is selected but payments group is invalid", () => {
    const paymentGroup = {valid: true};
    const sut = new PaymentReadinessTracker(paymentGroup);

    sut.selectedSavedPaymentMethod();
    sut.updateForStepChange();
    paymentGroup.valid = false;
    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  });

  it("Allows proceeding from payment step when donor has credit", () => {
    const sut = new PaymentReadinessTracker({valid: true});
    sut.donorHasCredit();
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it("Allows proceeding from payment step when donation credits are prepared", () => {
    const sut = new PaymentReadinessTracker({valid: true});
    sut.donationCreditsPrepared(1);
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it("Blocks proceeding from payment step when a saved card is selected but not to be used", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.selectedSavedPaymentMethod();
    sut.onUseSavedCardChange(false);
    sut.updateForStepChange();
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it("Allows proceeding from payment step when a complete payment card is given", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.onStripeCardChange({complete: true});
    sut.updateForStepChange();
    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  })

  it("Allows proceeding from payment step after updating billing details from payment method", () => {
    const sut = new PaymentReadinessTracker({valid: true});
    sut.formUpdatedWithBillingDetails();
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

    it("Blocks proceeding fromm payment step when an incomplete payment card is given", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.onStripeCardChange({complete: false});
    sut.updateForStepChange();
    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  })

  it("Blocks proceeding from payment step when a payment method is selected then cleared", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.selectedSavedPaymentMethod();
    sut.clearSavedPaymentMethod();
    sut.updateForStepChange();
    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  });
});
