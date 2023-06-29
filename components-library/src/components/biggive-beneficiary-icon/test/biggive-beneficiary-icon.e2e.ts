import { newE2EPage } from '@stencil/core/testing';

describe('biggive-beneficiary-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-beneficiary-icon></biggive-beneficiary-icon>');

    const element = await page.find('biggive-beneficiary-icon');
    expect(element).toHaveClass('hydrated');
  });
});
