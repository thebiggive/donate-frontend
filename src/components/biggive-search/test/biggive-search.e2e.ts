import { newE2EPage } from '@stencil/core/testing';

describe('biggive-search', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-search></biggive-search>');

    const element = await page.find('biggive-search');
    expect(element).toHaveClass('hydrated');
  });
});
