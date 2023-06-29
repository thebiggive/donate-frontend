import { newE2EPage } from '@stencil/core/testing';

describe('biggive-campaign-highlights', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-campaign-highlights></biggive-campaign-highlights>');

    const element = await page.find('biggive-campaign-highlights');
    expect(element).toHaveClass('hydrated');
  });
});
