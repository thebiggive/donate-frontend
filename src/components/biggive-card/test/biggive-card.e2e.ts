import { newE2EPage } from '@stencil/core/testing';

describe('biggive-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-card></biggive-card>');

    const element = await page.find('biggive-card');
    expect(element).toHaveClass('hydrated');
  });
});
