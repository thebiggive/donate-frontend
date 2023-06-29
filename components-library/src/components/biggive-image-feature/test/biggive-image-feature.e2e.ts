import { newE2EPage } from '@stencil/core/testing';

describe('biggive-image', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-image-feature></biggive-image-feature>');

    const element = await page.find('biggive-image-feature');
    expect(element).toHaveClass('hydrated');
  });
});
