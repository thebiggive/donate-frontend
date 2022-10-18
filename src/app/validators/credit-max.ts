import { AbstractControl } from '@angular/forms';

import { environment } from '../../environments/environment';

export function ValidateCurrencyMax(control: AbstractControl) {
  if (!control.value) {
    return null;
  }

  const value = Number(control.value.replace('£', '').replace('$', ''));

  if (value > environment.maximumCreditAmount) {
    return { max: true };
  }

  return null;
}
