import { PaymentGroupControls, PaymentReadinessTracker } from './PaymentReadinessTracker';

describe('PaymentReadinessTracker', () => {
  let paymentGroup: { valid: boolean; controls: PaymentGroupControls };
  beforeEach(() => {
    paymentGroup = { valid: true, controls: {} };
  });

  it('Initially says we are not ready to progress from payment step', () => {
    const sut = new PaymentReadinessTracker(paymentGroup);

    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  });

  it('Lists errors according to payment group controls.', () => {
    const sut = new PaymentReadinessTracker(paymentGroup);
    paymentGroup.controls = {
      firstName: { errors: { required: true } },
      lastName: { errors: { required: true } },
      emailAddress: { errors: { required: true } },
      billingPostcode: { errors: { required: true } },
    };

    expect(sut.getErrorsBlockingProgress()).toEqual([
      'Please enter your first name.',
      'Please enter your last name.',
      'Please enter your email address.',
      'Please enter your billing postcode.',
      'Please complete your payment method.',
    ]);
  });

  it('Allows proceeding from payment step when donor has credit', () => {
    const sut = new PaymentReadinessTracker(paymentGroup);
    sut.donorHasFunds();
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it('Allows proceeding from payment step when donation credits are prepared', () => {
    const sut = new PaymentReadinessTracker(paymentGroup);
    sut.donationFundsPrepared(1);
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it('Allows proceeding from payment step when a complete payment card is given', () => {
    const sut = new PaymentReadinessTracker(paymentGroup);

    sut.onStripeCardChange({ complete: true });
    expect(sut.readyToProgressFromPaymentStep).toBeTrue();
  });

  it('Blocks proceeding fromm payment step when an incomplete payment card is given', () => {
    const sut = new PaymentReadinessTracker(paymentGroup);

    sut.onStripeCardChange({ complete: false });
    expect(sut.readyToProgressFromPaymentStep).toBeFalse();
  });
});
