import { AbstractControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

export function ValidateCreditMin(control: AbstractControl) {
  if (!control.value) {
    return null;
  }

  const stringValue = control.value.replace('£', '').replace('$', '');
  if (stringValue === '') {
    return null;
  }

  const value = Number(stringValue);

  if (value < environment.minimumCreditAmount) {
    return { min: true };
  }

  return null;
}
