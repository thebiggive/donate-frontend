import { newE2EPage } from '@stencil/core/testing';

describe('biggive-quote', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-quote></biggive-quote>');

    const element = await page.find('biggive-quote');
    expect(element).toHaveClass('hydrated');
  });
});
