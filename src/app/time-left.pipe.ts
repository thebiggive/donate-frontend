import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/**
 * Pipe to summarise the time remaining to a given date.
 * Realtime update / AsyncPipe adaptation based on https://stackoverflow.com/a/36667685/2803757
 */
@Pipe({
  name: 'timeLeft',
  pure: false,
})
export class TimeLeftPipe extends AsyncPipe implements PipeTransform {
  timer: Observable<string>;
  value: Date;

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
      label: 'min', // We abbreviate to 'mins' and 'secs' to keep current card layout looking good
      value: 60000,
    },
    {
      label: 'sec',
      value: 1000,
    },
  ];

  constructor(ref: ChangeDetectorRef) {
    super(ref);
  }

  transform(date: any, args?: any[]): any {
    if (!(date instanceof Date)) { // Support ISO 8601 strings as returned by the Salesforce API
      date = new Date(date);
    }

    if (!date) {
      return super.transform(date);
    }

    this.value = date;
    if (!this.timer) {
      this.timer = this.getObservable();
    }

    return super.transform(this.timer);
  }

  private getObservable(): Observable<string> {
    return interval(1000).pipe(startWith(0), map(() => {
      for (const unit of this.unitDefinitions) {
        const wholeUnits = this.buildForUnit(this.value, unit.value);
        if (wholeUnits >= 1) {
          return (new DecimalPipe('en-GB')).transform(wholeUnits, '1.0-0') + ` ${unit.label}` + (wholeUnits > 1 ? 's' : '');
        }
      }

      return '0 secs';
    }));
  }

  private buildForUnit(date: Date, microsecsInUnit: number): number {
    return Math.floor((date.getTime() - (new Date()).getTime()) / microsecsInUnit);
  }
}
