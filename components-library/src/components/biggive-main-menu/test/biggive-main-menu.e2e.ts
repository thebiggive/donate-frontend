import { newE2EPage } from '@stencil/core/testing';

describe('biggive-main-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-main-menu></biggive-main-menu>');

    const element = await page.find('biggive-main-menu');
    expect(element).toHaveClass('hydrated');
  });
});
