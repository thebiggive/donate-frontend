import { newE2EPage } from '@stencil/core/testing';

describe('biggive-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-button></biggive-button>');

    const element = await page.find('biggive-button');
    expect(element).toHaveClass('hydrated');
  });
});
