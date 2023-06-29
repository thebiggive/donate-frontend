import { newE2EPage } from '@stencil/core/testing';

describe('biggive-footer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-footer></biggive-footer>');

    const element = await page.find('biggive-footer');
    expect(element).toHaveClass('hydrated');
  });
});
