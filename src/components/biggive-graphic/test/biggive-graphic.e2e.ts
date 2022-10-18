import { newE2EPage } from '@stencil/core/testing';

describe('biggive-graphic', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-graphic></biggive-graphic>');

    const element = await page.find('biggive-graphic');
    expect(element).toHaveClass('hydrated');
  });
});
