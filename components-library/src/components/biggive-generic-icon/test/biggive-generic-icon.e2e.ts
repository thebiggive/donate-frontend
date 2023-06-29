import { newE2EPage } from '@stencil/core/testing';

describe('biggive-generic-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-generic-icon></biggive-generic-icon>');

    const element = await page.find('biggive-generic-icon');
    expect(element).toHaveClass('hydrated');
  });
});
