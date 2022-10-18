import { AbstractControl } from '@angular/forms';

export function ValidateCreditMin(control: AbstractControl) {
  if (!control.value) {
    return null;
  }

  const stringValue = control.value.replace('£', '').replace('$', '');
  if (stringValue === '') {
    return null;
  }

  const value = Number(stringValue);

  if (value < 500) {
    return { min: true };
  }

  return null;
}
