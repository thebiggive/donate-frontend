import { newE2EPage } from '@stencil/core/testing';

describe('biggive-image', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-image></biggive-image>');

    const element = await page.find('biggive-image');
    expect(element).toHaveClass('hydrated');
  });
});
