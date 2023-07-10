import { AsyncPipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/**
 * Pipe to summarise the time remaining to a given date.
 * Realtime update / AsyncPipe adaptation based on https://stackoverflow.com/a/36667685/2803757
 */
@Pipe({
  standalone: true,
  name: 'timeLeft',
  pure: false,
})
export class TimeLeftPipe extends AsyncPipe implements PipeTransform {
    // static for access from object context and in interval callbacks
    public static unitDefinitions = [
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

  timer: Observable<string>;
  value: Date;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ref: ChangeDetectorRef,
  ) {
    super(ref);
  }

  public static format(date: Date) {
    for (const unit of TimeLeftPipe.unitDefinitions) {
      const wholeUnits = TimeLeftPipe.buildForUnit(date, unit.value);
      if (wholeUnits >= 1) {
        return (new DecimalPipe('en-GB')).transform(wholeUnits, '1.0-0') + ` ${unit.label}` + (wholeUnits > 1 ? 's' : '');
      }
    }

    return '0 secs';
  }

  public static buildForUnit(date: Date, microsecsInUnit: number): number {
    return Math.floor((date.getTime() - Date.now()) / microsecsInUnit);
  }

  transform(date: any, _args?: any[]): any {
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
    // On the browser / client-side JS, we set a 1 second interval so times can 'tick' live.
    if (isPlatformBrowser(this.platformId)) {
      return interval(1000).pipe(startWith(0), map(() => TimeLeftPipe.format(this.value)));
    }

    // On the server, get the value once; if we set an interval here, SSR spins forever and breaks the app!
    return of(TimeLeftPipe.format(this.value));
  }
}
