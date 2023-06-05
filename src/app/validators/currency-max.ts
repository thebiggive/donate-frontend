import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import { environment } from '../../environments/environment';

export function getCurrencyMaxValidator(limitOverride?: number): ValidatorFn {
  return (control: AbstractControl) : ValidationErrors | null => {
      if (!control.value) {
          return null;
      }

      const value = Number(control.value.replace('£', '').replace('$', ''));

      let effectiveLimit = environment.maximumDonationAmount;
      if (limitOverride !== undefined) {
        effectiveLimit = limitOverride;
      }

      if (value > effectiveLimit) {
          return {
              max: true
          };
      }

      return null;
  };
}
