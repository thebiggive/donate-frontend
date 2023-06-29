import { newE2EPage } from '@stencil/core/testing';

describe('biggive-progress-bar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-progress-bar></biggive-progress-bar>');

    const element = await page.find('biggive-progress-bar');
    expect(element).toHaveClass('hydrated');
  });
});
