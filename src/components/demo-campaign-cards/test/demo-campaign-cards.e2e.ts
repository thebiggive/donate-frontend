import { newE2EPage } from '@stencil/core/testing';

describe('campaign-cards', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<demo-campaign-cards></demo-campaign-cards>');

    const element = await page.find('demo-campaign-cards');
    expect(element).toHaveClass('hydrated');
  });
});
