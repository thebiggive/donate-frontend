import { newE2EPage } from '@stencil/core/testing';

describe('sample-component-child', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sample-component-child></sample-component-child>');

    const element = await page.find('sample-component-child');
    expect(element).toHaveClass('hydrated');
  });
});
