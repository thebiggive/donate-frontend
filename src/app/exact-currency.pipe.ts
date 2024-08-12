import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format currency
 * * without disregarding any precision (i.e. for donations and matching, not stats);
 * * without decimals when the value is a whole number of £;
 * * with correct padding otherwise (£1.50 not £1.5).
 */
@Pipe({
  standalone: true,
  name: 'exactCurrency',
})
export class ExactCurrencyPipe implements PipeTransform {
  transform(value: any, currencyCode = 'GBP'): any {
    // We expect and allow extra £ signs. We can't do this with commas because the
    // delineation is ambiguous across regions and we don't want donors to accidentally
    // give 100x more than they expect!
    if (typeof value === 'string') {
      value = value.replace('£', '').replace('$', '');

      if (value.includes(',')) {
        return undefined;
      }
    }

    // Donor inputs get passed to this pipe directly, so we need to ensure non-numeric
    // input can't crash the app.
    value = Number(value);
    if (isNaN(value)) {
      return undefined;
    }

    // Start by always including 2 d.p., even if £*.00, which is `CurrencyPipe`'s
    // default behaviour.
    let formatted = (new CurrencyPipe('en-GB', currencyCode).transform(value));
    if (formatted?.endsWith('.00')) {
      formatted = formatted.slice(0, -3);
    }

    return formatted;
  }
}
