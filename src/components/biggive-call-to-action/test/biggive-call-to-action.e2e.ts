import { newE2EPage } from '@stencil/core/testing';

describe('biggive-call-to-action', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-call-to-action></biggive-call-to-action>');

    const element = await page.find('biggive-call-to-action');
    expect(element).toHaveClass('hydrated');
  });
});
