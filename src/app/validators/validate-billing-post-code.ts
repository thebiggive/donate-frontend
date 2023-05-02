import { AbstractControl } from '@angular/forms';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ValidateBillingPostCode(c: AbstractControl) {
    return {
        invalidBillingPostCode: true
    };
};
