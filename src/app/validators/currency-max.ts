import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { maximumDonationAmountForCardDonation } from '../donation.model';

export function getCurrencyMaxValidator(limitOverride?: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = Number(control.value.replace('£', '').replace('$', ''));

    const effectiveLimit = limitOverride ?? maximumDonationAmountForCardDonation;

    if (value > effectiveLimit) {
      return {
        max: true,
      };
    }

    return null;
  };
}
