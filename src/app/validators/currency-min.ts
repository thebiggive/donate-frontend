import { AbstractControl } from '@angular/forms';

export function ValidateCurrencyMin(control: AbstractControl) {
  if (!control.value) {
    return null;
  }

  const stringValue = control.value.replace('£', '');
  if (stringValue === '') {
    return null;
  }

  const value = Number(stringValue);

  if (value < 5) {
    return { min: true };
  }

  return null;
}
