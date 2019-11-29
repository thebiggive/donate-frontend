import { TimeLeftPipe } from './time-left.pipe';

describe('TimeLeftPipe', () => {
  it('is instantiated', () => {
    const pipe = new TimeLeftPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns 1 minute correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 61000); // 61 seconds in the future

    expect((new TimeLeftPipe()).transform(futureDate)).toEqual('1 min');
  });

  it('returns 23 hours correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 23 * 60 * 60 * 1000 + 10000); // 23 hours and 10 seconds in the future

    expect((new TimeLeftPipe()).transform(futureDate)).toEqual('23 hours');
  });

  it('returns 1 day correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 86410000); // 1 day and 10 seconds in the future

    expect((new TimeLeftPipe()).transform(futureDate)).toEqual('1 day');
  });

  it('returns 1,000 days correctly', () => {
    const futureDate = new Date((new Date()).getTime() + 1000 * 86410000); // 1,000 days and 10 seconds in the future

    expect((new TimeLeftPipe()).transform(futureDate)).toEqual('1,000 days');
  });
});
