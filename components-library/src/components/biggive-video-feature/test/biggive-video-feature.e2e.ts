import { newE2EPage } from '@stencil/core/testing';

describe('biggive-video', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-video-feature></biggive-video-feature>');

    const element = await page.find('biggive-video-feature');
    expect(element).toHaveClass('hydrated');
  });
});
