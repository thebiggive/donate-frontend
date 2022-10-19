import { newE2EPage } from '@stencil/core/testing';

describe('biggive-campaign-card-filter-grid', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-campaign-card-filter-grid></biggive-campaign-card-filter-grid>');

    const element = await page.find('biggive-campaign-card-filter-grid');
    expect(element).toHaveClass('hydrated');
  });
});
