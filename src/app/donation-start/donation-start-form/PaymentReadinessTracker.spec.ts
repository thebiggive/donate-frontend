import {PaymentReadinessTracker} from "./PaymentReadinessTracker";

describe('PaymentReadinessTracker', () => {
  it('Initially says we are not ready to progress from payment step', () => {
    const sut = new PaymentReadinessTracker({valid: true});

    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  })

  it("Allows proceeding from payment step when a saved card is selected", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.selectedSavedPaymentMethod();
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it("Blocks proceeding from payment step when a saved card is selected but payments group is invalid", () => {
    const paymentGroup = {valid: true};
    const sut = new PaymentReadinessTracker(paymentGroup);

    sut.selectedSavedPaymentMethod();
    paymentGroup.valid = false;
    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  });

  it("Allows proceeding from payment step when donor has credit", () => {
    const sut = new PaymentReadinessTracker({valid: true});
    sut.donorHasFunds();
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it("Allows proceeding from payment step when donation credits are prepared", () => {
    const sut = new PaymentReadinessTracker({valid: true});
    sut.donationFundsPrepared(1);
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it("Allows proceeding from payment step when a saved card is selected ", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.selectedSavedPaymentMethod();
    sut.onUseSavedCardChange(true);
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it("Blocks proceeding from payment step when a saved card is selected but not to be used", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.selectedSavedPaymentMethod();
    sut.onUseSavedCardChange(false);
    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  });

  it("Allows proceeding from payment step when a complete payment card is given", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.onStripeCardChange({complete: true});
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  })

    it("Blocks proceeding fromm payment step when an incomplete payment card is given", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.onStripeCardChange({complete: false});
    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  })

  it("Blocks proceeding from payment step when a payment method is selected then cleared", () => {
    const sut = new PaymentReadinessTracker({valid: true});

    sut.selectedSavedPaymentMethod();
    sut.clearSavedPaymentMethod();
    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  });
});
