import { newE2EPage } from '@stencil/core/testing';

describe('biggive-grid', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-grid></biggive-grid>');

    const element = await page.find('biggive-grid');
    expect(element).toHaveClass('hydrated');
  });
});
