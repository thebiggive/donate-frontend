import { newE2EPage } from '@stencil/core/testing';

describe('biggive-tabbed-content', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-tabbed-content></biggive-tabbed-content>');

    const element = await page.find('biggive-tabbed-content');
    expect(element).toHaveClass('hydrated');
  });
});
