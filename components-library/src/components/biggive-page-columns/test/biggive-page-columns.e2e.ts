import { newE2EPage } from '@stencil/core/testing';

describe('biggive-page-columns', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-page-columns></biggive-page-columns>');

    const element = await page.find('biggive-page-columns');
    expect(element).toHaveClass('hydrated');
  });
});
