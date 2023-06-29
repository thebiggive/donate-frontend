import { newE2EPage } from '@stencil/core/testing';

describe('biggive-category-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-category-icon></biggive-category-icon>');

    const element = await page.find('biggive-category-icon');
    expect(element).toHaveClass('hydrated');
  });
});
