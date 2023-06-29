import { newE2EPage } from '@stencil/core/testing';

describe('biggive-biography-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-biography-card></biggive-biography-card>');

    const element = await page.find('biggive-biography-card');
    expect(element).toHaveClass('hydrated');
  });
});
