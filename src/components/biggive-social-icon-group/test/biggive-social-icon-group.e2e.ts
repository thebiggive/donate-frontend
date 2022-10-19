import { newE2EPage } from '@stencil/core/testing';

describe('biggive-social-icon-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-social-icon-group></biggive-social-icon-group>');

    const element = await page.find('biggive-social-icon-group');
    expect(element).toHaveClass('hydrated');
  });
});
