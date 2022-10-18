import { newE2EPage } from '@stencil/core/testing';

describe('biggive-campaign-card-filter-grid', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-campaign-filter-grid></biggive-campaign-filter-grid>');

    const element = await page.find('biggive-campaign-filter-grid');
    //expect(element).toHaveClass('hydrated');
  });
});
