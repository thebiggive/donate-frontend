import {AbstractControl, ValidatorFn} from "@angular/forms";

/**
 * Checks that the control is filled in, and that the content is not soley whitespace.
 *
 * In case of error returns `{required: true}` to be a direct drop-in replacement for the Angular built
 * in required validator, that does allow all whitespace. See
 * https://github.com/angular/angular/issues/29813
 */
export const requiredNotBlankValidator: ValidatorFn = (control: AbstractControl) => {
  if (control.value === null) {
    return {required: true}
  }

  if (typeof (control.value) === 'string' && control.value.trim() === '') {
    return {required: true}
  }

  return null;
}
