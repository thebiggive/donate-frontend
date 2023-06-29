import { newE2EPage } from '@stencil/core/testing';

describe('biggive-hero-image', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-hero-image></biggive-hero-image>');

    const element = await page.find('biggive-hero-image');
    expect(element).toHaveClass('hydrated');
  });
});
