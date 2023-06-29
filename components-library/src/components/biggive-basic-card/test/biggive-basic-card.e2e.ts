import { newE2EPage } from '@stencil/core/testing';

describe('biggive-basic-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-basic-card></biggive-basic-card>');

    const element = await page.find('biggive-basic-card');
    expect(element).toHaveClass('hydrated');
  });
});
