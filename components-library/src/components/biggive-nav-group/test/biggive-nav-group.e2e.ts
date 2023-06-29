import { newE2EPage } from '@stencil/core/testing';

describe('biggive-nav-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-nav-group></biggive-nav-group>');

    const element = await page.find('biggive-nav-group');
    expect(element).toHaveClass('hydrated');
  });
});
