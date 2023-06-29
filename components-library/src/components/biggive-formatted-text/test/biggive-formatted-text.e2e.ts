import { newE2EPage } from '@stencil/core/testing';

describe('biggive-formatted-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-formatted-text></biggive-formatted-text>');

    const element = await page.find('biggive-formatted-text');
    expect(element).toHaveClass('hydrated');
  });
});
