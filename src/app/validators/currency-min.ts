import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function getCurrencyMinValidator(limitOverride?: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = Number(control.value.replace('£', '').replace('$', ''));

    let effectiveLimit = 0;
    if (limitOverride !== undefined) {
      effectiveLimit = Math.max(effectiveLimit, limitOverride);
    }

    if (value < effectiveLimit) {
      return {
        min: true,
      };
    }

    return null;
  };
}
