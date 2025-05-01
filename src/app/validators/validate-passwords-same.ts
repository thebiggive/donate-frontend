import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function getPasswordValidator(password?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const confirmPassword: string = control.value;
    if (!confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : { notSame: true };
  };
}
