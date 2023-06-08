import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {maximumDonationAmount} from "../donation.model";

export function getCurrencyMaxValidator(limitOverride?: number): ValidatorFn {
  return (control: AbstractControl) : ValidationErrors | null => {
      if (!control.value) {
          return null;
      }

      const value = Number(control.value.replace('£', '').replace('$', ''));

      let effectiveLimit = maximumDonationAmount;
      if (limitOverride !== undefined) {
        effectiveLimit = Math.min(effectiveLimit, limitOverride);
      }

      if (value > effectiveLimit) {
          return {
              max: true
          };
      }

      return null;
  };
}
