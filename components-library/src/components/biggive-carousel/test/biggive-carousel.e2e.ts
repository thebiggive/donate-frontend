import { newE2EPage } from '@stencil/core/testing';

describe('biggive-carousel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-carousel></biggive-carousel>');

    const element = await page.find('biggive-carousel');
    expect(element).toHaveClass('hydrated');
  });
});
