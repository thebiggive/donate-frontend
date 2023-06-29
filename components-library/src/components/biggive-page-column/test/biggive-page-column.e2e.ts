import { newE2EPage } from '@stencil/core/testing';

describe('biggive-page-column', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-page-column></biggive-page-column>');

    const element = await page.find('biggive-page-column');
    expect(element).toHaveClass('hydrated');
  });
});
