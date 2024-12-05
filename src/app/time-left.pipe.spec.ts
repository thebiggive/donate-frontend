import {ChangeDetectorRef, PLATFORM_ID} from '@angular/core';
import { TestBed} from '@angular/core/testing';

import { TimeLeftPipe } from './time-left.pipe';

describe('TimeLeftPipe', () => {
  let pipe: TimeLeftPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
  });

  beforeEach(() => {
    const cdRefMock: ChangeDetectorRef = {
      checkNoChanges: () => null,
      detach: () => null,
      detectChanges: () => null,
      markForCheck: () => null,
      reattach: () => null,
    };
    pipe = new TimeLeftPipe(TestBed.inject(PLATFORM_ID), cdRefMock);
  });

  it('is instantiated', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns 0 seconds for past times', () => {
    const futureDate = new Date((new Date()).getTime() - 100000);

    expect(pipe.transform(futureDate)).toEqual('0 secs');
  });

  it('returns 0 seconds for very near future times', () => {
    const futureDate = new Date((new Date()).getTime() + 100); // 0.1 seconds in the future

    expect(pipe.transform(futureDate)).toEqual('0 secs');
  });

  it('returns 1 sec correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 1100); // 1.1 seconds in the future

    expect(pipe.transform(futureDate)).toEqual('1 sec');
  });

  it('returns 1 min correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 61000); // 61 seconds in the future

    expect(pipe.transform(futureDate)).toEqual('1 min');
  });

  it('returns 23 hours correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 23 * 60 * 60 * 1000 + 10000); // 23 hours and 10 seconds in the future

    expect(pipe.transform(futureDate)).toEqual('23 hours');
  });

  it('returns 1 day correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 86410000); // 1 day and 10 seconds in the future

    expect(pipe.transform(futureDate)).toEqual('1 day');
  });

  it('returns 1,000 days correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 1000 * 86410000); // 1,000 days and 10 seconds in the future

    expect(pipe.transform(futureDate)).toEqual('1,000 days');
  });
});
