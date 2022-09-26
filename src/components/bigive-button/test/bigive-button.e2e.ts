import { newE2EPage } from '@stencil/core/testing';

describe('bigive-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bigive-button></bigive-button>');

    const element = await page.find('bigive-button');
    expect(element).toHaveClass('hydrated');
  });
});
