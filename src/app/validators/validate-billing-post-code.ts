import { AbstractControl } from '@angular/forms';

export function ValidateBillingPostCode(_: AbstractControl) {
    return {
        invalidBillingPostCode: true
    };
};
