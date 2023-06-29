import { newE2EPage } from '@stencil/core/testing';

describe('biggive-boxed-content', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-boxed-content></biggive-boxed-content>');

    const element = await page.find('biggive-boxed-content');
    expect(element).toHaveClass('hydrated');
  });
});
