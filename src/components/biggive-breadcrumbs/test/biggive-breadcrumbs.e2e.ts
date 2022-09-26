import { newE2EPage } from '@stencil/core/testing';

describe('biggive-breadcrumbs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-breadcrumbs></biggive-breadcrumbs>');

    const element = await page.find('biggive-breadcrumbs');
    expect(element).toHaveClass('hydrated');
  });
});
