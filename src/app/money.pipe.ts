import {Pipe, PipeTransform} from "@angular/core";
import {ExactCurrencyPipe} from "./exact-currency.pipe";
import {Money} from './Money';

/**
 * Formats a money object as a string. Currently, the money object is only used in regular giving mandates, (hence
 * the type being defined in the mandate model file) but it may be expanded to much wider use in future).
 */
@Pipe({
  standalone: true,
  name: 'money',
})
export class MoneyPipe implements PipeTransform {
  transform(money: Money): string {
    return MoneyPipe.format(money);
  }

  public static format(money: Money) {
    const exactCurrencyPipe = new ExactCurrencyPipe();

    // Delegate actual work to pre-existing pipe that takes a number. At some point we can consider removing the
    // old pipe, maybe first swapping the delegation relationship around.
    const formatted = exactCurrencyPipe.transform(money.amountInPence / 100, money.currency);

    if (typeof formatted !== "string") {
      throw new Error("Could not format money value: " + money.toString());
    }

    return formatted;
  }
}
