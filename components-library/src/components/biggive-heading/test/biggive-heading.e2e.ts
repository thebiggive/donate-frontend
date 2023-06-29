import { newE2EPage } from '@stencil/core/testing';

describe('biggive-heading', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-heading></biggive-heading>');

    const element = await page.find('biggive-heading');
    expect(element).toHaveClass('hydrated');
  });
});
