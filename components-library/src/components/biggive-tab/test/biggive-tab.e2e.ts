import { newE2EPage } from '@stencil/core/testing';

describe('biggive-tab', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-tab></biggive-tab>');

    const element = await page.find('biggive-tab');
    expect(element).toHaveClass('hydrated');
  });
});
