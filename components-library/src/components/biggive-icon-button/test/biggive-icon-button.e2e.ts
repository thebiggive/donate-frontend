import { newE2EPage } from '@stencil/core/testing';

describe('biggive-icon-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-icon-button></biggive-icon-button>');

    const element = await page.find('biggive-icon-button');
    expect(element).toHaveClass('hydrated');
  });
});
