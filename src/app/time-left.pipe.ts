import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to summarise the time remaining to a given date.
 */
@Pipe({
  name: 'timeLeft',
})
export class TimeLeftPipe implements PipeTransform {
  private unitDefinitions = [
    {
      label: 'day',
      value: 86400000,
    },
    {
      label: 'hour',
      value: 3600000,
    },
    {
      label: 'min',
      value: 60000,
    },
    {
      label: 'sec',
      value: 1000,
    },
  ];

  transform(date: Date | string): string {
    if (!(date instanceof Date)) { // Support ISO 8601 strings as returned by the Salesforce API
      date = new Date(date);
    }

    for (const unit of this.unitDefinitions) {
      const wholeUnits = this.buildForUnit(date, unit.value);
      if (wholeUnits >= 1) {
        return (new DecimalPipe('en-GB')).transform(wholeUnits, '1.0-0') + ` ${unit.label}` + (wholeUnits > 1 ? 's' : '');
      }
    }

    return '0 secs';
  }

  private buildForUnit(date: Date, microsecsInUnit: number): number {
    return Math.floor((date.getTime() - (new Date()).getTime()) / microsecsInUnit);
  }
}
