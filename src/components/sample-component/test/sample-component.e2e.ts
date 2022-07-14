import { newE2EPage } from '@stencil/core/testing';

describe('sample-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sample-component></sample-component>');

    const element = await page.find('sample-component');
    expect(element).toHaveClass('hydrated');
  });
});
