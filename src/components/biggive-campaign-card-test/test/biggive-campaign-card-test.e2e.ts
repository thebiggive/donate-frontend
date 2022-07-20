import { newE2EPage } from '@stencil/core/testing';

describe('biggive-campaign-card-test', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-campaign-card-test></biggive-campaign-card-test>');

    const element = await page.find('biggive-campaign-card-test');
    expect(element).toHaveClass('hydrated');
  });
});
