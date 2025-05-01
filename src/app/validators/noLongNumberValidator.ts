import { AbstractControl, ValidatorFn } from '@angular/forms';

export const LONG_NUMBER = 'LONG_NUMBER';
export const MIN_LENGTH_BANNED = 6;

// same regex as in matchbot, to catch six numbers in a row see
// https://github.com/thebiggive/matchbot/blob/80173b9c95b821a81870a493ec3bba4a921a127f/src/Domain/DonorName.php#L31
const sixDigitsRegex = /\d\s?\d\s?\d\s?\d\s?\d\s?\d/;

export const noLongNumberValidator: ValidatorFn = (control: AbstractControl) => {
  const valueAsString = control.value + '';
  if (valueAsString.match(sixDigitsRegex)) {
    return { [LONG_NUMBER]: true };
  } else {
    return null;
  }
};
