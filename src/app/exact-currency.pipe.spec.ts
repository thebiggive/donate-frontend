import { ExactCurrencyPipe } from './exact-currency.pipe';

describe('ExactCurrencyPipe', () => {
  let pipe: ExactCurrencyPipe;

  beforeEach(() => {
    pipe = new ExactCurrencyPipe();
  });

  it('is instantiated', () => {
    expect(pipe).toBeTruthy();
  });

  it('shows no decimal with whole numbers of pounds and currency code GBP', () => {
    expect(pipe.transform(12345, 'GBP')).toEqual('£12,345');
  });

  it('shows no decimal with whole numbers of pounds and currency code USD', () => {
    expect(pipe.transform(12345, 'USD')).toEqual('$12,345');
  });

  it('shows no decimal with whole numbers of pounds', () => {
    expect(pipe.transform(12345)).toEqual('£12,345');
  });

  it('pads correctly with £*.50', () => {
    expect(pipe.transform(1234.5)).toEqual('£1,234.50');
  });

  it('works with values not requiring padding', () => {
    expect(pipe.transform(123.45)).toEqual('£123.45');
  });

  it('rounds unexpected > 2 d.p. values to 2 d.p.', () => {
    expect(pipe.transform(12.345)).toEqual('£12.35');
  });

  it('works with £ input by donors', () => {
    expect(pipe.transform('£1234.5')).toEqual('£1,234.50');
  });

  it(`bails out but doesn't crash when a comma is entered`, () => {
    expect(pipe.transform('12,345')).toEqual(undefined);
  });

  it(`bails out when input is not numeric at all`, () => {
    expect(pipe.transform('hello')).toEqual(undefined);
  });
});
