import { newE2EPage } from '@stencil/core/testing';

describe('biggive-page-section', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-page-section></biggive-page-section>');

    const element = await page.find('biggive-page-section');
    expect(element).toHaveClass('hydrated');
  });
});
