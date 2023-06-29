import { newE2EPage } from '@stencil/core/testing';

describe('biggive-social-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-social-icon></biggive-social-icon>');

    const element = await page.find('biggive-social-icon');
    expect(element).toHaveClass('hydrated');
  });
});
