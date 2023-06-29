import { newE2EPage } from '@stencil/core/testing';

describe('biggive-timeline', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-timeline></biggive-timeline>');

    const element = await page.find('biggive-timeline');
    expect(element).toHaveClass('hydrated');
  });
});
