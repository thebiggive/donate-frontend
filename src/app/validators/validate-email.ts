import { FormControl } from '@angular/forms';

export function ValidateEmail(c: FormControl) {
  // RegExp loosely based on SF charity onboarding one with some improvements for readability and length
  // check on final a-z token. We found Angular's `Validators.email` too permissive.
  const EMAIL_REGEXP = new RegExp('[a-z0-9.!#$%&*/=?^_+-`{|}~\'_%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$', 'i');

  // Valid emails MUST pass regexp check and not include semi-colon(s) before the @ sign.
  // The semi-colon check is because the regexp above can sometimes miss some invalid edge cases.
  // See DON-490 for more information.
  const isValid: boolean = EMAIL_REGEXP.test(c.value) && (!c.value.split('@')[0].includes(';'));

  return isValid ? null : {
    ValidateEmail: {
      valid: false
    }
  };
}