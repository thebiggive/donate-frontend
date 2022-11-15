import { newE2EPage } from '@stencil/core/testing';

describe('biggive-popup-standalone', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-popup-standalone></biggive-popup-standalone>');

    const element = await page.find('biggive-popup-standalone');
    expect(element).toHaveClass('hydrated');
  });
});
