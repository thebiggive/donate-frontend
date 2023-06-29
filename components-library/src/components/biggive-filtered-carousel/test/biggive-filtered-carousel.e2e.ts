import { newE2EPage } from '@stencil/core/testing';

describe('biggive-filtered-carousel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-filtered-carousel></biggive-filtered-carousel>');

    const element = await page.find('biggive-filtered-carousel');
    expect(element).toHaveClass('hydrated');
  });
});
