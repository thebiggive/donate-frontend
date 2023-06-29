import { newE2EPage } from '@stencil/core/testing';

describe('biggive-nav-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-nav-item></biggive-nav-item>');

    const element = await page.find('biggive-nav-item');
    expect(element).toHaveClass('hydrated');
  });
});
