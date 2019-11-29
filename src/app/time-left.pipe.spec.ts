import { ChangeDetectorRef } from '@angular/core';

import { TimeLeftPipe } from './time-left.pipe';

describe('TimeLeftPipe', () => {
  let pipe: TimeLeftPipe;

  beforeEach(() => {
    const cdRefMock: ChangeDetectorRef = {
      checkNoChanges: () => null,
      detach: () => null,
      detectChanges: () => null,
      markForCheck: () => null,
      reattach: () => null,
    };
    pipe = new TimeLeftPipe(cdRefMock);
  });

  it('is instantiated', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns 0 seconds for past times', () => {
    const futureDate = new Date((new Date()).getTime() - 100000);

    expect(pipe.transform(futureDate)).toEqual('0 seconds');
  });

  it('returns 0 seconds for very near future times', () => {
    const futureDate = new Date((new Date()).getTime() + 100); // 0.1 seconds in the future

    expect(pipe.transform(futureDate)).toEqual('0 seconds');
  });

  it('returns 1 second correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 1100); // 1.1 seconds in the future

    expect(pipe.transform(futureDate)).toEqual('1 second');
  });

  it('returns 1 minute correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 61000); // 61 seconds in the future

    expect(pipe.transform(futureDate)).toEqual('1 minute');
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
