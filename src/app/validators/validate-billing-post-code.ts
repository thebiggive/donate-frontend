import { AbstractControl } from '@angular/forms';

export function ValidateBillingPostCode(stripeResponseErrorCode: string | undefined) {
    return (c: AbstractControl) => {
        const isValid: boolean = stripeResponseErrorCode != 'incorrect_zip';
        return isValid ? null : {
          invalidBillingPostCode: true
        };
    };
}