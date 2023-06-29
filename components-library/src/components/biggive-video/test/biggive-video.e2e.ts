import { newE2EPage } from '@stencil/core/testing';

describe('biggive-video', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-video></biggive-video>');

    const element = await page.find('biggive-video');
    expect(element).toHaveClass('hydrated');
  });
});
