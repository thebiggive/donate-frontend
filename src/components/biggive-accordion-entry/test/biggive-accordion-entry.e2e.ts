import { newE2EPage } from '@stencil/core/testing';

describe('biggive-accordion-entry', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-accordion-entry></biggive-accordion-entry>');

    const element = await page.find('biggive-accordion-entry');
    expect(element).toHaveClass('hydrated');
  });
});
