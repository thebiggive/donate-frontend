import { newE2EPage } from '@stencil/core/testing';

describe('biggive-totalizer-ticker-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-totalizer-ticker-item></biggive-totalizer-ticker-item>');

    const element = await page.find('biggive-totalizer-ticker-item');
    expect(element).toHaveClass('hydrated');
  });
});
