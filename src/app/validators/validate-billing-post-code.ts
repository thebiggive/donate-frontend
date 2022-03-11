import { AbstractControl } from '@angular/forms';

export function ValidateBillingPostCode(c: AbstractControl) {
    return {
        invalidBillingPostCode: true
    };
};