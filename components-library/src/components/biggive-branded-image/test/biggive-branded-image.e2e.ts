import { newE2EPage } from '@stencil/core/testing';

describe('biggive-branded-image', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-branded-image></biggive-branded-image>');

    const element = await page.find('biggive-branded-image');
    expect(element).toHaveClass('hydrated');
  });
});
