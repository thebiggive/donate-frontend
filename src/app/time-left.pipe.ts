import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to summarise the time remaining (currently always in days) to a given date.
 */
@Pipe({
  name: 'timeLeft',
})
export class TimeLeftPipe implements PipeTransform {
  transform(date: Date | string): string {
    if (!(date instanceof Date)) { // Support ISO 8601 strings as returned by the Salesforce API
      date = new Date(date);
    }

    const days: number = Math.floor((date.getTime() - (new Date()).getTime()) / 86400000);

    return (new DecimalPipe('en-GB')).transform(days, '1.0-0') + (days === 1 ? ' day' : ' days');
  }
}
