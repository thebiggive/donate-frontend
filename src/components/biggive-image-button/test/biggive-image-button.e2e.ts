import { newE2EPage } from '@stencil/core/testing';

describe('biggive-image-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-image-button></biggive-image-button>');

    const element = await page.find('biggive-image-button');
    expect(element).toHaveClass('hydrated');
  });
});
