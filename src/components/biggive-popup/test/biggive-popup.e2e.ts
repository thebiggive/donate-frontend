import { newE2EPage } from '@stencil/core/testing';

describe('biggive-popup', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-popup></biggive-popup>');

    const element = await page.find('biggive-popup');
    expect(element).toHaveClass('hydrated');
  });
});
