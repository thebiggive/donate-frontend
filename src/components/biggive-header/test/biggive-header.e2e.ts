import { newE2EPage } from '@stencil/core/testing';

describe('biggive-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-header></biggive-header>');

    const element = await page.find('biggive-header');
    expect(element).toHaveClass('hydrated');
  });
});
