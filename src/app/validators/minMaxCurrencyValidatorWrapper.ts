
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function minMaxCurrencyValidatorWrapper(isMinValidation: boolean, limit: number): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        if (!control.value) {
            return null;
        }

        const value = Number(control.value.replace('£', '').replace('$', ''));

        if (isMinValidation) {
            if (value < limit ) {
                return {
                    min: true
                };
            }
        }

        else {
            if (value > limit) {
                return {
                    max: true
                };
            }
        }
    
        return null;
    }
}