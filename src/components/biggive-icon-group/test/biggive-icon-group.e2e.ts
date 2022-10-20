import { newE2EPage } from '@stencil/core/testing';

describe('biggive-social-icon-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-icon-group></biggive-icon-group>');

    const element = await page.find('biggive-icon-group');
    expect(element).toHaveClass('hydrated');
  });
});
