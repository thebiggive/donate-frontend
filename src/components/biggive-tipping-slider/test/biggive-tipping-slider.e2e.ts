import { newE2EPage } from '@stencil/core/testing';

describe('biggive-tipping-slider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-tipping-slider></biggive-tipping-slider>');

    const element = await page.find('biggive-tipping-slider');
    expect(element).toHaveClass('hydrated');
  });
});
