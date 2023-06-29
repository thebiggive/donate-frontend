import { newE2EPage } from '@stencil/core/testing';

describe('biggive-back-to-top', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-back-to-top></biggive-back-to-top>');

    const element = await page.find('biggive-back-to-top');
    expect(element).toHaveClass('hydrated');
  });
});
