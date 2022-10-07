import { newE2EPage } from '@stencil/core/testing';

describe('biggive-section', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-section></biggive-section>');

    const element = await page.find('biggive-section');
    expect(element).toHaveClass('hydrated');
  });
});
