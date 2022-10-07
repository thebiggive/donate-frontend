import { newE2EPage } from '@stencil/core/testing';

describe('biggive-dropdown', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-dropdown></biggive-dropdown>');

    const element = await page.find('biggive-dropdown');
    expect(element).toHaveClass('hydrated');
  });
});
