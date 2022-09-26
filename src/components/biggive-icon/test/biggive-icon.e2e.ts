import { newE2EPage } from '@stencil/core/testing';

describe('biggive-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-icon></biggive-icon>');

    const element = await page.find('biggive-icon');
    expect(element).toHaveClass('hydrated');
  });
});
