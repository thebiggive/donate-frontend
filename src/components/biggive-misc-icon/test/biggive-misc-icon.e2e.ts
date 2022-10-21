import { newE2EPage } from '@stencil/core/testing';

describe('biggive-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-misc-icon></biggive-misc-icon>');

    const element = await page.find('biggive-misc-icon');
    expect(element).toHaveClass('hydrated');
  });
});
