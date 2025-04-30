import { maximumDonationAmount } from './donation.model';
describe('Maximum donation value function', () => {
  it('Is 25k when the user has no funds stored', () => {
    const creditPenceToUse = 0;

    const max = maximumDonationAmount('GBP', creditPenceToUse);

    expect(max).toBe(25_000);
  });

  it('Is 200k when the user has 500k stored', () => {
    const creditPenceToUse = 500_000_00;

    const max = maximumDonationAmount('GBP', creditPenceToUse);

    expect(max).toBe(200_000);
  });

  it('Is 20k when the user has 20k stored', () => {
    const creditPenceToUse = 20_000_00;

    const max = maximumDonationAmount('GBP', creditPenceToUse);

    expect(max).toBe(20_000);
  });
});
