import {Pipe, PipeTransform} from "@angular/core";

/**
 * Formats a number as an ordinal, e.g. 1st, 2nd, or 3rd.
 */
@Pipe({
  standalone: true,
  name: 'ordinal',
})
export class OrdinalPipe implements PipeTransform {
  transform(n: number): string {
    if (n > 3 && n < 21) return n + 'th';
    switch (n % 10) {
      case 1:  return n + "st";
      case 2:  return n + "nd";
      case 3:  return n + "rd";
      default: return n + "th";
    }
  }
}
