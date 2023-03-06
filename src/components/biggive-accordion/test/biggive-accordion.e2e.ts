import { newE2EPage } from '@stencil/core/testing';

describe('biggive-accordion', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-accordion></biggive-accordion>');

    const element = await page.find('biggive-accordion');
    expect(element).toHaveClass('hydrated');
  });
});
