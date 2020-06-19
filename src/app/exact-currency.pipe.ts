import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format currency
 * * without disregarding any precision (i.e. for donations and matching, not stats);
 * * without decimals when the value is a whole number of £;
 * * with correct padding otherwise (£1.50 not £1.5).
 */
@Pipe({
  name: 'exactCurrency',
  pure: false,
})
export class ExactCurrencyPipe implements PipeTransform {
  transform(currency: any, args?: any[]): any {
    // Start by always including 2 d.p., even if £*.00, which is `CurrencyPipe`'s
    // default behaviour.
    let formatted = (new CurrencyPipe('en-GB', 'GBP').transform(currency));
    if (formatted?.endsWith('.00')) {
      formatted = formatted.slice(0, -3);
    }

    return formatted;
  }
}
