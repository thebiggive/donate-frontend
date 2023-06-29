import { newE2EPage } from '@stencil/core/testing';

describe('biggive-campaign-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-campaign-card></biggive-campaign-card>');

    const element = await page.find('biggive-campaign-card');
    expect(element).toHaveClass('hydrated');
  });
});
